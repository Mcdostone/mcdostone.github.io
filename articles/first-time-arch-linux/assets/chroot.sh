#!/usr/bin/env bash

set -xeuo pipefail

# Allow up to 5 parallel downloads
sed -i 's/#ParallelDownloads = 5/ParallelDownloads = 5/' /etc/pacman.conf

# Install base packages
pacman --noconfirm -S iwd curl iputils vim dhcpcd sudo base-devel git man nvidia bluez bluez-utils alsa-tools pulseaudio alsa-utils ttf-fira-code
systemctl enable iwd
systemctl start iwd
systemctl enable dhcpcd
systemctl start dhcpcd
systemctl enable bluetooth
# Disable bluetooth on boot
sed -i 's/#AutoEnable=true/AutoEnable=false/' /etc/bluetooth/main.conf
# Remove kms from the HOOKS array in /etc/mkinitcpio.conf - https://wiki.archlinux.org/title/NVIDIA#Installation
sed -i 's/ kms / /g' /etc/mkinitcpio.conf
mkinitcpio -P

# Setup zoneinfo
ln -sf /usr/share/zoneinfo/Europe/Paris /etc/localtime

# Sync time
hwclock --systohc

# Select locales
sed -i 's/#en_US.UTF-8/en_US.UTF-8/g' /etc/locale.gen
sed -i 's/#fr_FR.UTF-8/fr_FR.UTF-8/g' /etc/locale.gen
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf
echo "KEYMAP=fr-latin1" > /etc/vconsole.conf
echo "$USER" > /etc/hostname

# Install Grub
pacman --noconfirm -S intel-ucode grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# Install Gnome Desktop environment
pacman -S --noconfirm gnome gnome-tweaks gnome-shell-extensions networkmanager gnome-terminal gtk-engine-murrine gtk4 mesa powerline powerline-fonts
systemctl enable gdm
systemctl enable NetworkManager
# I don't need these packages
pacman --noconfirm -R gnome-maps gnome-weather gnome-contacts gnome-clocks gnome-music epiphany totem

# Post install instructions
pacman -S --noconfirm fish firefox-developer-edition flatpak
useradd -mG wheel -s /bin/bash "$USER"
echo "$USER:$PASSWORD" | chpasswd
sed -i 's/# %wheel /%wheel /' /etc/sudoers
chsh -s /bin/fish "$USER"

# hide applications from the gnome search menu
echo -e "NoDisplay=true" | tee -a /usr/share/applications/org.gnome.Characters.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/org.gnome.Epiphany.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/qv4l2.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/org.gnome.Console.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/avahi-discover.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/envy24control.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/bvnc.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/qvidcap.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/hdspconf.desktop 
echo -e "NoDisplay=true" | tee -a /usr/share/applications/hdspmixer.desktop 
echo -e "NoDisplay=true" | tee -a /usr/share/applications/hwmixvolume.desktop 
echo -e "NoDisplay=true" | tee -a /usr/share/applications/hdajackretask.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/yelp.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/bssh.desktop
echo -e "NoDisplay=true" | tee -a /usr/share/applications/lstopo.desktop 
echo -e "NoDisplay=true" | tee -a /usr/share/applications/fish.desktop 

# Install yay
su -s /bin/bash "$USER" <<EOF
cp /startup.sh "/home/$USER/startup.sh" 
sed -i "s/###SSID/$SSID/g" /home/$USER/startup.sh
sed -i "s/###WIFI_PASSPHRASE/$WIFI_PASSPHRASE/g" /home/$USER/startup.sh
sed -i "s/###EMAIL/$EMAIL/g" /home/$USER/startup.sh
sed -i "s/###FULLNAME/$FULLNAME/g" /home/$USER/startup.sh
if ! command -v yay &> /dev/null; then
    rm -rf /tmp/yay
    git clone https://aur.archlinux.org/yay.git /tmp/yay
    cd /tmp/yay && makepkg --noconfirm -si
    rm -rf /tmp/yay
fi

yay --save --answerclean All --answerdiff None
yay -Sy --noconfirm python-pip visual-studio-code-bin mkinitcpio-numlock
EOF
sed -i 's/; enable-deferred-volume = yes/enable-deferred-volume = no/' /etc/pulse/daemon.conf
sed -i 's/%wheel ALL=(ALL:ALL) NOPASSWD: ALL/# %wheel ALL=(ALL:ALL) NOPASSWD: ALL/' /etc/sudoers
exit

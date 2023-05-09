#!/usr/bin/env bash

set -euo pipefail

DIR=$(dirname "$0")
SSID="###SSID"
WIFI_PASSPHRASE="###WIFI_PASSPHRASE"
EMAIL="###EMAIL"
FULLNAME="###FULLNAME"

# Configure git
git config --global user.email "$EMAIL"
git config --global user.name "$FULLNAME"
ssh-keygen -t ed25519 -C "$EMAIL" -f "$HOME/.ssh/id_ed25519" -N ""

gsettings set org.gnome.desktop.input-sources sources "[('xkb', 'fr')]"
sudo localectl set-keymap fr

# Connect to the Internet
nmcli device wifi connect "$SSID" password "$WIFI_PASSPHRASE"

yay --save --answerclean All --answerdiff None
yay -Sy --noconfirm python-pip systemd-numlockontty 
sudo systemctl enable numLockOnTty

cd /tmp
# Install bitwareden and ublock-origin
firefox-developer-edition https://addons.mozilla.org/en-US/firefox/addon/bitwarden-password-manager/ https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/ https://github.com/settings/keys https://addons.mozilla.org/en-US/firefox/addon/duckduckgo-for-firefox/ &

# Tweak gnome
cd /tmp
git clone https://github.com/vinceliuice/Colloid-gtk-theme.git /tmp/theme
cd /tmp/theme && bash install.sh
rm -rf /tmp/theme
cd /tmp
git clone https://github.com/vinceliuice/WhiteSur-icon-theme.git /tmp/icons
cd /tmp/icons && bash install.sh
rm -rf /tmp/icons
yay --noconfirm -Sy apple_cursor apple-fonts

# Install oh-my-fish
cd
curl https://raw.githubusercontent.com/oh-my-fish/oh-my-fish/master/bin/install > /tmp/install.sh
fish -lic "fish /tmp/install.sh --noninteractive --yes"
fish -lic "omf install agnoster"

# Install gnome-extensions-cli
cd
pip3 install --upgrade gnome-extensions-cli

# Install gnome extensions
~/.local/bin/gnome-extensions-cli install quick-settings-tweaks@qwreey rounded-window-corners@yilozt blur-my-shell@aunetx dash-to-dock@micxgx.gmail.com user-theme@gnome-shell-extensions.gcampax.github.com remove-alt-tab-delay@daase.net windowIsReady_Remover@nunofarruca@gmail.com no-overview@fthx start-overlay-in-application-view@Hex_cz just-perfection-desktop@just-perfection nightthemeswitcher@romainvigier.fr search-light@icedman.github.com noannoyance@daase.net
gnome-extensions enable user-theme@gnome-shell-extensions.gcampax.github.com
gnome-extensions enable just-perfection-desktop@just-perfection
gnome-extensions enable search-light@icedman.github.com
gnome-extensions enable rounded-window-corners@yilozt
gnome-extensions enable nightthemeswitcher@romainvigier.fr
gnome-extensions enable blur-my-shell@aunetx
gnome-extensions enable dash-to-dock@micxgx.gmail.com
gnome-extensions enable noannoyance@daase.net
gnome-extensions enable remove-alt-tab-delay@daase.net
gnome-extensions enable windowIsReady_Remover@nunofarruca@gmail.com

# Theme for gnome-terminal
dconf write /org/gnome/terminal/legacy/profiles:/:b1dcc9dd-5262-4d8d-a863-c897e6d979b9/use-theme-colors "false"
dconf write /org/gnome/terminal/legacy/profiles:/:b1dcc9dd-5262-4d8d-a863-c897e6d979b9/background-color "'rgb(0,43,54)'"
dconf write /org/gnome/terminal/legacy/profiles:/:b1dcc9dd-5262-4d8d-a863-c897e6d979b9/foreground-color "'rgb(131,148,150)'"
dconf write /org/gnome/terminal/legacy/profiles:/:b1dcc9dd-5262-4d8d-a863-c897e6d979b9/palette "['rgb(7,54,66)', 'rgb(220,50,47)', 'rgb(133,153,0)', 'rgb(181,137,0)', 'rgb(38,139,210)', 'rgb(211,54,130)', 'rgb(42,161,152)', 'rgb(238,232,213)', 'rgb(0,43,54)', 'rgb(203,75,22)', 'rgb(88,110,117)', 'rgb(101,123,131)', 'rgb(131,148,150)', 'rgb(108,113,196)', 'rgb(147,161,161)', 'rgb(253,246,227)']"

# Theme for gnome-shell
mkdir -p /home/$USER/Pictures/wallpaper
curl -L "https://github.com/Mcdostone/misc/raw/main/wallpaper.tar.xz" | tar xJv -C /home/$USER/Pictures/wallpaper
gsettings set org.gnome.desktop.background picture-uri "file:///home/$USER/Pictures/wallpaper/0.jpg"
gsettings set org.gnome.desktop.background picture-uri-dark "file:///home/$USER/Pictures/wallpaper/1.jpg"
gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark'
gsettings set org.gnome.desktop.interface icon-theme 'WhiteSur'
gsettings set org.gnome.shell.extensions.user-theme name "Colloid-Light"
gsettings set org.gnome.desktop.interface gtk-theme "Colloid-Light"
gsettings set org.gnome.desktop.wm.preferences button-layout ":minimize,close"
gsettings set org.gnome.desktop.interface cursor-theme 'macOS-BigSur-White'
gsettings set org.gnome.desktop.interface enable-hot-corners false
gsettings set org.gnome.desktop.peripherals.touchpad click-method areas
gsettings set org.gnome.desktop.peripherals.touchpad tap-to-click true
gsettings set org.gnome.desktop.peripherals.touchpad two-finger-scrolling-enabled true
gsettings set org.gnome.desktop.peripherals.touchpad speed 0
gsettings set org.gnome.desktop.peripherals.keyboard numlock-state true
gsettings set org.gnome.desktop.peripherals.keyboard remember-numlock-state true
gsettings set org.gnome.shell favorite-apps "['org.gnome.Nautilus.desktop', 'firefoxdeveloperedition.desktop', 'org.gnome.Terminal.desktop', 'code.desktop', 'com.spotify.Client.desktop', 'com.discordapp.Discord.desktop' ]"
gsettings set org.gnome.desktop.search-providers disabled "['org.gnome.clocks.desktop', 'org.gnome.Characters.desktop', 'org.gnome.Calendar.desktop', 'org.gnome.Photos.desktop', 'org.gnome.Epiphany.desktop']"
gsettings set org.gnome.settings-daemon.plugins.media-keys custom-keybindings "['/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0/']"
gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0/ name 'open terminal'
gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0/ command 'gnome-terminal'
gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0/ binding '<Control><Alt>t'
gsettings set org.gnome.desktop.interface document-font-name 'SF Pro Display Light 11'
gsettings set org.gnome.desktop.interface font-antialiasing 'grayscale'
gsettings set org.gnome.desktop.interface font-hinting 'slight'
gsettings set org.gnome.desktop.interface font-name 'SF Pro Display Light 11'
gsettings set org.gnome.desktop.interface monospace-font-name 'SF Mono Medium 10'
gsettings set org.gnome.desktop.wm.preferences titlebar-font 'SF Pro Display Light 11'

gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.gtk-variants enabled true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.gtk-variants day 'Colloid-Light'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.gtk-variants night 'Colloid-Dark'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.shell-variants day 'Colloid-Light'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.shell-variants enabled true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.shell-variants night 'Colloid-Dark'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.icon-variants day 'WhiteSur'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.icon-variants enabled true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.icon-variants night 'WhiteSur-dark'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.cursor-variants day 'macOS-BigSur-White'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.cursor-variants enabled true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/nightthemeswitcher@romainvigier.fr/schemas/ set org.gnome.shell.extensions.nightthemeswitcher.cursor-variants night 'macOS-BigSur'

gsettings --schemadir ~/.local/share/gnome-shell/extensions/search-light@icedman.github.com/schemas/ set org.gnome.shell.extensions.search-light background-color '(0.0, 0.0, 0.0, 0.70333331823348999)'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/search-light@icedman.github.com/schemas/ set org.gnome.shell.extensions.search-light blur-background true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/search-light@icedman.github.com/schemas/ set org.gnome.shell.extensions.search-light blur-brightness 0.51000000000000001
gsettings --schemadir ~/.local/share/gnome-shell/extensions/search-light@icedman.github.com/schemas/ set org.gnome.shell.extensions.search-light blur-sigma 11.0
gsettings --schemadir ~/.local/share/gnome-shell/extensions/search-light@icedman.github.com/schemas/ set org.gnome.shell.extensions.search-light border-radius '2.60'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/search-light@icedman.github.com/schemas/ set org.gnome.shell.extensions.search-light scale-height '0.3'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/search-light@icedman.github.com/schemas/ set org.gnome.shell.extensions.search-light scale-width '0.3'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/search-light@icedman.github.com/schemas/ set org.gnome.shell.extensions.search-light shortcut-search "['<Control>space']"

gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell brightness 0.55
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell sigma 10
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock blur false
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock brightness 0.59
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock color "(0.0, 0.0, 0.0, 0.0)"
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock customize true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock noise-amount 0.0
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock noise-lightness 0.0
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock override-background true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock sigma 30
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock static-blur true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock style-dash-to-dock 1
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.dash-to-dock unblur-in-overview false
gsettings --schemadir ~/.local/share/gnome-shell/extensions/blur-my-shell@aunetx/schemas/ set org.gnome.shell.extensions.blur-my-shell.panel blur true


gsettings --schemadir ~/.local/share/gnome-shell/extensions//just-perfection-desktop@just-perfection/schemas/ set org.gnome.shell.extensions.just-perfection clock-menu-position 1
gsettings --schemadir ~/.local/share/gnome-shell/extensions//just-perfection-desktop@just-perfection/schemas/ set org.gnome.shell.extensions.just-perfection activities-button false
gsettings --schemadir ~/.local/share/gnome-shell/extensions//just-perfection-desktop@just-perfection/schemas/ set org.gnome.shell.extensions.just-perfection window-demands-attention-focus true
gsettings --schemadir ~/.local/share/gnome-shell/extensions//just-perfection-desktop@just-perfection/schemas/ set org.gnome.shell.extensions.just-perfection startup-status 1

gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock pressure-threshold 0
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock disable-overview-on-startup true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock apply-custom-theme true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock apply-glossy-effect true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock autohide true
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock autohide-in-fullscreen false
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock background-color 'rgb(0,0,0)'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock transparency-mode 'DYNAMIC'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock running-indicator-style 'DOTS'
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock show-show-apps-button false
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com/schemas/ set org.gnome.shell.extensions.dash-to-dock intellihide false
gsettings set org.gnome.desktop.wm.preferences focus-new-windows 'smart'

# Install volta.sh
curl https://get.volta.sh | bash
fish -c "volta install node"

#cat /proc/asound/card0/codec* | grep Codec
#Codec: Realtek ALC255
echo "options snd_hda_intel index=0 model=alc255-asus,dell-headset-multi" | sudo  tee /etc/modprobe.d/alsa-base.conf
pacmd set-source-volume 1 32000


## Visual studio code
yay --noconfirm -Sy ttf-jetbrains-mono
code /tmp
sleep 5
killall code
curl -L https://raw.githubusercontent.com/Mcdostone/misc/main/settings.json --output "$HOME/.config/Code/User/settings.json"

# Some software I need
flatpak install -y flathub com.spotify.Client org.signal.Signal com.discordapp.Discord com.jetbrains.IntelliJ-IDEA-Ultimate org.videolan.VLC

# Delete this script
rm "$DIR/$0"
exit

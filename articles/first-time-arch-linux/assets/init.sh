#!/usr/bin/env bash

set -euo pipefail

DIR=$(dirname "$0")

function download {
    local url="$1"
    local output="$2"
    if [ ! -f "$output" ]; then
        printf "Download %s\n" "$url"
        curl -L "$url" --output "$output"
    fi
}

# Download missing scripts
download "$URL_SCRIPTS/init.sh" "$DIR/init.sh"
download "$URL_SCRIPTS/chroot.sh" "$DIR/chroot.sh"
download "$URL_SCRIPTS/startup.sh" "$DIR/startup.sh"

# Generate default .env file
if [ ! -f "$DIR/.env" ]; then
    printf "Create %s\n" "$DIR/.env"
    echo -e "DISK=/dev/sda
SSID='XXX'
WIFI_PASSPHRASE='XXX'
USER='user'
PASSWORD='user-passw0rd'
EMAIL='foo@example.com'
FULLNAME='Foo Bar'
URL_SCRIPTS='https://mcdostone.github.io/articles/first-time-arch-linux/assets'" > "$DIR/.env"
    if [ -v SSID ]; then
        sed -i "s/SSID='XXX'/SSID='$SSID'/" "$DIR/.env"
    fi
    if [ -v WIFI_PASSPHRASE ]; then 
        sed -i "s/WIFI_PASSPHRASE='XXX'/WIFI_PASSPHRASE='$WIFI_PASSPHRASE'/" "$DIR/.env"
    fi
    exit 0
fi

# Load env variables in .env
export $(xargs < "$DIR/.env")

# Azerty keyboard
loadkeys fr-latin1
chmod 755 "$DIR/startup.sh" "$DIR/chroot.sh"

# Connect to the Internet
iwctl station wlan0 connect "$SSID" --passphrase "$WIFI_PASSPHRASE"

# Sync time and hardware clock
timedatectl
hwclock -w

# Umount /mnt if already mounted and disable swapping
umount -R /mnt || true
swapoff --all

# Partitioning - https://wiki.archlinux.org/title/Installation_guide#Partition_the_disks
# Delete /dev/sda1, /dev/sda2, /dev/sda3, /dev/sda4
partitions=$(ls $DISK* | grep -o '[0-9]' || true)
printf "%s" "$partitions" | xargs -t -I {} bash -c "printf 'd\n{}\nw\n' | fdisk $DISK"

sleep 1
partprobe
## Boot partition
printf 'g\nn\n\n\n+1g\ny\nw\n' | fdisk "$DISK"
sleep 1
printf 't\n1\nw\n' | fdisk "$DISK"

sleep 1
## Swap partition
printf 'n\n\n\n+4g\ny\nw\n' | fdisk "$DISK"
sleep 1
printf 't\n2\nswap\nw\n' | fdisk "$DISK"

sleep 1
## Root partition
printf 'n\n\n\n\nY\nw\n' | fdisk "$DISK"

## Format partitions https://wiki.archlinux.org/title/Installation_guide#Format_the_partitions
mkfs.ext4 -F /dev/sda3
mkswap /dev/sda2
mkfs.fat -F 32 /dev/sda1
mount /dev/sda3 /mnt
mount --mkdir /dev/sda1 /mnt/boot
swapon /dev/sda2

# Install Arch Linux
pacstrap -K /mnt base linux linux-firmware

# Generate an fstab file
genfstab -U /mnt >> /mnt/etc/fstab

# Copy other scripts files
cp "$DIR/chroot.sh" /mnt/init.sh
cp "$DIR/startup.sh" /mnt/startup.sh
arch-chroot /mnt /bin/bash -c "USER='${USER}' PASSWORD='${PASSWORD}' SSID='${SSID}' WIFI_PASSPHRASE='${WIFI_PASSPHRASE}' EMAIL='${EMAIL}' FULLNAME='${FULLNAME}' /init.sh"

# Clean scripts
rm /mnt/init.sh
rm /mnt/startup.sh

# Umount the root partition
umount -R /mnt
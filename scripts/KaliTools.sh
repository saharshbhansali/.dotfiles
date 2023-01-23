#!/bin/bash

# Update package lists
sudo dnf update -y

# Information gathering
sudo dnf install -y nmap whois dig netdiscover fierce recon-ng theharvester

# Vulnerability Analysis
sudo dnf install -y metasploit-framework sqlmap w3af

# Web Applications
sudo dnf install -y burpsuite

# Wireless Attack
sudo dnf install -y aircrack-ng kismet wifite

# Exploitation Tools
sudo dnf install -y metasploit-framework sqlmap

# Password Attacks
sudo dnf install -y john hashcat cain

# Forensics
sudo dnf install -y autopsy volatility sleuthkit

# Reverse Engineering
sudo dnf install -y ghidra radare2

echo "Security tools have been installed!"


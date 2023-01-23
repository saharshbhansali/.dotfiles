 
#!/bin/bash

# Update package lists
sudo dnf update -y

# Install development tools
sudo dnf groupinstall -y "Development Tools"

# Install dependencies
sudo dnf install -y git python3-dev python3-pip ruby-devel libpcap-dev libssl-dev

# Clone sources
git clone https://github.com/sqlmapproject/sqlmap.git
git clone https://github.com/aircrack-ng/aircrack-ng.git
git clone https://github.com/rapid7/metasploit-framework.git
git clone https://github.com/GHDB/john.git
git clone https://github.com/hashcat/hashcat.git

# Build and install sqlmap
cd sqlmap
python3 setup.py install

# Build and install aircrack-ng
cd ../aircrack-ng
make
sudo make install

# Build and install metasploit-framework
cd ../metasploit-framework
bundle install

# Build and install John the Ripper
cd ../john/src
./configure && make
sudo make install

# Build and install hashcat
cd ../../hashcat
make
sudo make install


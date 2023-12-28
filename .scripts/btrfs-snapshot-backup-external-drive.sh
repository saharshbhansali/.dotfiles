## Create btrfs filesystems with labels 
  sudo mkfs.btrfs -L snapshot-source /dev/path/to/device1
  sudo mkfs.btrfs -L snapshot-destination /dev/path/to/device2
 
## Create mountpoints for the filesystems and mount them 
  sudo mkdir -v /{src,dest}
  sudo mount /dev/path/to/device1 /src
  sudo mount /dev/path/to/device2 /dest
  df -h -t btrfs
 
## Create the source btrfs subvolume
  sudo btrfs subvolume create /src/src-subvol-name
# ----- Data modification is done here -----
## Create the snapshot storage directory in the destination device 
  sudo mkdir /src/.snapshots
  
## Create a read-only snapshot 
  sudo btrfs --verbose subvolume snapshot -r /src/src-subvol-name /src/.snapshots/snapshot-name
  sudo btrfs subvolume list /src
 
## Send the snapshot fromt the src subvolume to the destination subvolume 
  sudo btrfs --verbose send /src/.snapshots/snapshot-name | sudo --verbose btrfs receive /dest 
 
## Check if snapshot was transferred 
  sudo btrfs subvolume list /dest
  cat /dest/snapshot-name/<file-name>
  tree -a /dest
  sudo btrfs subvolume show /dest/snapshot-name
 
## For Incremental Backup 
# ----- Data modification is done here -----
## Create a new read-only snapshot 
  sudo btrfs --verbose subvolume snapshot -r /src/src-subvol-name /src/.snapshots/new-snapshot-name
  sudo btrfs subvolume list /src
  sudo btrfs --verbose send -p /src/.snapshots/snapshot-name /src/.snapshots/new-snapshot-name | sudo --verbose btrfs receive /dest 
 
## Check if snapshot was transferred 
  sudo btrfs subvolume list /dest
  cat /dest/snapshot-name/<file-name>
  tree -a /dest
  sudo btrfs subvolume show /dest/snapshot-name
  
## Clean up old snapshots 
  sudo btrfs subvolume delete {/src/.snapshots|/dest}/old-snapshot-name
 
## Restore snapshot from external drive 
  sudo btrfs send /dest/snapshot-name | sudo btrfs receive /src/.snapshots
  sudo btrfs subvolume list /src/.snapshots
  cat /src/.snapshots/snapshot-name/<file-name>
  tree -a /src/.snapshots
  sudo btrfs subvolume show /src/.snapshots/snapshot-name
  

## [Reference](https://linuxhint.com/back_up_btrfs_snapshots_external_drives/)

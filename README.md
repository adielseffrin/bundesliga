# Bundesliga match table

> A small single page application based on vue.js
> Source code are available as well as the Vagrantfile and the build files.

## Pre-requisites
> Virtualbox

> Vagrant

> Vue.js (if you want to run in dev mode)

## Build Setup

``` bash
# Vagrantfile points to local address 192.168.33.10 (you can run directly or add an instance in your host files)

# The Vagrantfile is configured to use ubuntu/trusty64 box. If you need to get you can run:
vagrant box add ubuntu/trusty64

# after cloning the repository, go to Vangrant folder and run it
vagrant up

# A bootstrap file to configure nginx is also included. If doesn't work you can reload box and explicit call the provision method
vagrant reload --provision

# Then access the address 192.168.33.10 in the browser or that one you configured early

# That's it
```

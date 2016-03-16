# LPCFlash

A GUI for programming flash based microcontrollers from [NXP](http://www.nxp.com/microcontrollers) using a serial protocol.

It implements a function similar to [Flash Magic](http://www.flashmagictool.com) but using [Electron](http://electron.atom.io) and [FlashMagic.js](https://github.com/claudio-destro/flashmagic.js) instead.

## Build

I usually have `./node_modules/.bin` in my `PATH` so I just have to execute the following commands to perform a clean build:

```bash
# cd build
# npm install
# cd ..
# npm install
# typings install
# gulp publish
```
After the last command, the file `lpcflash.asar` should be present in the project's root directory.

## Test

Run with the following command

```bash
# electron lpcflash.asar
```

## Disclaimer

This tool is **not** related to [Flash Magic](http://www.flashmagictool.com).

Its primary objective is just to communicate with a custom USB bootloader by using a well-known protocol.

A side effect is to be **100% compatible** with legacy [NXP](http://www.nxp.com/microcontrollers) serial bootloader.

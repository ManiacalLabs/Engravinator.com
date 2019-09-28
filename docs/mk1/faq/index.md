---
page_title: Engravinator Mk1 &mdash; FAQ
---

# Engravinator Mk1 &mdash; FAQ

## Why did you create the Engravinator?

It started with a conversation about woodworking. We wanted to be able to engrave a custom maker's mark on something large like furniture but most engravers assumed the material would be brought to the machine. This was not feasible in many cases. So the idea for a super-portable engraver with small working area that could be brought to the material was born.

To take things further, most engravers in the $200 - $400 price range were, in our opinion, of poor build quality and precision. Using simple wheels and belts for motion. So we sought to hit the same price point but with higher quality and precision motion components.

## Is it Open Source?

Yes!!! 100% yes! The designs for the Engravinator itself are all available in the [Engravinator GitHub repository](https://github.com/ManiacalLabs/Engravinator) and are under the CERN OHL.

Even this website and guide are available in the [Engravinator.com GitHub repository](https://github.com/ManiacalLabs/Engravinator.com) and under CC-BY-SA-4.0

## What controls the Engravinator?

It was designed specifically to be used the popular [Grbl](https://github.com/gnea/grbl) firmware. It's simple to use, robust, and has a great community. As such you could technically use any Grbl controller but we recommend using our own [Platypus](https://github.com/ManiacalLabs/Platypus) Grbl board, which was designed specifically for use with the Engravinator.

However, we provide mounts for multiple control boards, all of which can be found in the [fabrication files](https://github.com/ManiacalLabs/Engravinator/tree/master/Mk1/Fabrication/3D_Printed/Controller_Box). More details can be found in that directory along with each file.

## What do I need to build an Engravinator?

We tried to keep the design as simple and easy to build as possible. All the hardware can be easily ordered from the links provided in the [Bill of Materials](/mk1/buy/). All other components are either 3D printed (required core components) or laser cut (optional enclosure) and more details can be found on the [Fabrication page](/mk1/print/).

The only tools required are:

-   4mm Hex Key
-   2.5mm Hex Key
-   2mm Hex Key
-   1.5mm Hex Key
-   Flush Cut Snippers
-   Wire Strippers
-   Scissors
-   Square
-   Soldering Iron
-   Flat Surface

For more information, please check out the [Assembly Guide](/mk1/build/).

## How long does it take to build?

Depending on your skill level, it should take 4-8 hours to complete.

For more information, please check out the [Assembly Guide](/mk1/build/).

## How much does it cost to build?

Depending on the options you choose and which laser module you buy, it should cost between $300 and $400.

For more information, please check out the [Buyer's Guide](/mk1/buy/)

## Do I need special eyewear?

If you don't build it with the full enclosure, then yes!!! Even still, yes!

Look, lasers are dangerous and you've only got the 2 eyes. Never look anywhere near the laser beam without protection. The enclosure will protect you in most situations, but it's very helpful to have safety glasses during setup and when focusing the laser.

## Can I use it with something other than a laser?

Yes! The Engravinator is designed to be extremely customizable and we've even designed a servo-driven pen-lift mechanism to turn it into a plotter. More details on that to be added soon.

But with all of the CAD designs provided it would be easy to design any addon you would like, as long as it doesn't require a proper Z axis ;)

## What types of materials can it engrave?

First, please note: The Engravinator is **not** meant for cutting! It does not have a proper bed required for cleaning cutting through materials. Please stick to engraving.

This is largely dependent on your laser module of choice, but assuming you are using a standard UV diode laser you will generally want to stick to darker, organic materials. Overly white or clean materials will not absorb enough of the laser to work correctly. Materials we've found to work well include (but are not limited to):

-   Paper / Cardstock (not white)
-   Cardboard
-   Poplar
-   Birch
-   Balsa
-   Cherry
-   MDF
-   Slate
-   Cork
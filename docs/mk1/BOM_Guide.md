# BOM Buyer's Guide

We have tried to keep the Bill of Materials (BOM) as simple as possible with as few sources as possible. However, there are a number of things to keep in mind if you are sourcing all of your own components. **Before** ordering your components, please be sure to read this guide in full.

## Misumi vs McMaster-Carr

If you are just building a single Engravinator, buying all of the hardware components from Misumi is by far the least expensive option. The per unit cost of the nuts and bolts is more than at McMaster, however the *total* cost will be less as McMaster requires you to buy all bolts in minimum quantities (usually 50 or 100). Since some of the components *must* come from Misumi it's easier and cheaper to just buy everything from Misumi.

The one exception to this is the M3 nuts which will be discussed next.

If you, however, have a reason to purchase some of the components from McMaster, use the part numbers provided below and be careful to check you purchase enough, based on how many Engravinators you are building.

| Component       | Part Number                                     |
|-----------------|-------------------------------------------------|
| M2 x 8mm Screw  | [91290A015](https://www.mcmaster.com/91290A015) |
| M3 x 5mm Screw  | [91290A110](https://www.mcmaster.com/91290A110) |
| M3 x 10mm Screw | [91290A115](https://www.mcmaster.com/91290A115) |
| M3 x 15mm Screw | [91290A572](https://www.mcmaster.com/91290A572) |
| M3 x 20mm Screw | [91290A123](https://www.mcmaster.com/91290A123) |
| M3 x 25mm Screw | [91290A125](https://www.mcmaster.com/91290A125) |
| M3 x 30mm Screw | [91290A130](https://www.mcmaster.com/91290A130) |
| M3 Nut          | [91828A211](https://www.mcmaster.com/91828A211) |

## M3 Nuts

For some reason, Misumi seems to really not want to sell M3 nuts. They will sell them to you, of course, but the cheapest we've found, the [SLBNR3](https://us.misumi-ec.com/vona2/detail/110300250540/?HissuCode=SLBNR3), are 34 cents each!

For this reason we recommend getting them elsewhere. One option is McMaster as listed in the above section. You'll get a box of 100, which is more than enough and, if that's all you get, it'll be about $11 shipped.

But you can also likely find them somewhere else like Amazon, eBay, or Aliexpress. Or if you are lucky enough to live in the non-imperial units rest of the world... your local hardware store.

**Just be sure that what you get is M3 with a 0.5mm thread pitch, 2.4mm thick, and 5.5mm flat-to-flat as shown below.**

![M3 nut dimensions](img/91828A211.gif)

## Belts & Pulleys

In small quantities we've never found a specific supplier from which to purchase belts and pulleys. We recommend Amazon, eBay, or Aliexpress. Just be absolutely sure that what you purchase matches the listed dimensions. We have designed the Engravinator to accommodate small variations in overall pulley size, however you should fine pulleys as close as possible to:

- Drive: GT2-16 tooth, 5mm bore, 13mm OD, 6mm belt width
- Idler: GT2-16 tooth, 3mm bore, 13mm OD, 6mm belt width

For the belts, you need two 600mm sections of GT2-6mm belt. Note that some places may list it as 2GT which is the same thing. It *must* be 6mm wide though!

## Power Supply

This is dependent on the controller you are using but we will assume you are using the [Maniacal Labs Platypus](https://maniacallabs.com/platypus) or similar. In which case, you will require a 12V switching AC/DC adapter with at least 6A output and a 2.1mm, center-positive, barrel connector.

Something like this from DigiKey would work well: [GST90A12-P1M](https://www.digikey.com/product-detail/en/mean-well-usa-inc/GST90A12-P1M/1866-2154-ND/7703717)

However, we get that's expensive and you can likely find something cheaper on Amazon or eBay such as this one: https://www.amazon.com/gp/product/B00LWQ2GS0/

Just make sure it meets the specs listed above.

## Controller & Stepper Drivers

The [Maniacal Labs Platypus](https://maniacallabs.com/platypus) controller was designed specifically with the Engravinator in mind and all guides assume you will be using this controller. However, any 2+ axis controller with laser support should work fine. So if you have a preferred controller we won't be insulted

For stepper drivers, if your controller of course does not have them built in, we highly recommend the TMC2208 SilentStepStick, as listed in the BOM. Any StepStick / Pololu style driver that supports at least 1/16 microstepping should work though.

## Aluminum Extrusions

You might be tempted to just buy a long length of 2020 extrusion and cut your own pieces. **Resist this temptation!!**

The Engravinator is designed with tight tolerances and the aluminum extrusion creates the foundation of the entire machine. Which must be perfectly square and of exact size. All the extrusions from Misumi, cut to within 0.5mm of the required length, are only $36 for the set and well worth the cost.

## Enclosure Acrylic

If you do not have access to a laser cutter and need someone else to cut the acrylic for you, please checkout the [Fabrication Guide](Fabrication.html#enclosure---laser-cut-parts).

__*DISCLAIMER*__: *Our research has shown that the suggested acrylic below will block any and all dangerous light coming from the laser, making it safe to use without special glasses. However, without acquiring laboratory tested (and much more expensive) acrylic that is specifically validated for this use we cannot guarantee your complete eye safety. Maniacal Labs assumes no responsibility for any damage or injury caused by use of these designs.*

If you have your own laser cutter (with at least a 400mm x 300mm working area) and want to cut your own enclosure panels, you'll need the right acrylic. It must be 3mm (1/8") thick, semi-transparent, and ideally orange, red, or green.

We highly recommend using #2422 orange such as [this from EStreet Plastics](https://www.estreetplastics.com/1-8-inch-transparent-orange-2422-plexiglass-sheets-s/137.htm)



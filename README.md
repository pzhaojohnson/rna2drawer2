# RNA2Drawer 2

A [web app](https://rna2drawer.app) for creating 2D drawings of nucleic acid structures.
The layout, bonds and styling (e.g., colors and fonts) of a drawing
can all be easily customized within the app.
Drawings are exported in PPTX and SVG formats
such that all elements of a drawing (e.g., bases and bonds)
are exported as individual PPTX and SVG objects,
allowing for further manipulation in PowerPoint and vector graphics editors such as Adobe Illustrator.

This project is a successor to the [first version](https://github.com/pzhaojohnson/RNA2Drawer#rna2drawer) of RNA2Drawer,
which was published in the journal <em>RNA Biology</em>.

&nbsp;&nbsp;&nbsp;&nbsp;<b>Article:</b> [https://doi.org/10.1080/15476286.2019.1659081](https://doi.org/10.1080/15476286.2019.1659081)

&nbsp;&nbsp;&nbsp;&nbsp;<b><em>If you use RNA2Drawer to draw structures in a publication, please cite the above article.</em></b>

If you have questions or find issues, email [help@rna2drawer.app](mailto:help@rna2drawer.app) or open an issue thread here on GitHub.
Feature requests are also welcome!

<p align="center" >
  <img src="./demo/example1.svg" width="800px" />
</p>

&nbsp;&nbsp;&nbsp;&nbsp;[Creating a New Drawing](#creating-a-new-drawing)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Opening a Saved Drawing](#saving-a-drawing-and-opening-a-saved-drawing)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Saving a Drawing](#saving-a-drawing-and-opening-a-saved-drawing)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Tools](#tools)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[The Dragging Tool](#the-dragging-tool)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[The Pairing Tool](#the-pairing-tool)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[The Flattening and Flipping Tools](#the-flattening-and-flipping-tools)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[The Editing Tool](#the-editing-tool)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Line Drawings](#line-drawings)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Exporting Your Drawing](#exporting-your-drawing)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Frequently Asked Questions](#frequently-asked-questions)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Funding](#funding)

## Creating a New Drawing

Open the form to create a new drawing via the link on the welcome page
or via the `File`: `New` menu button.
In the form,
enter the sequence for your drawing
and its ID.

The structure for your drawing may also be entered in dot-bracket notation.
This notation is commonly created by structure prediction programs
such as Mfold and RNAFold
and may be referred to as "Vienna" format.

Example inputs can be selected at the top of the form.
Parameters controlling how the sequence and structure are read in by the program
can be opened via the details toggles above the top right corners
of the sequence and structure text boxes.

## Saving a Drawing and Opening a Saved Drawing

Clicking the `File`: `Save` menu button will download a file with `.rna2drawer2` extension,
which contains a complete representation of your now saved drawing.
By default your web browser will place the file in your downloads folder,
though this can be changed in your browser settings.

To open a saved drawing,
navigate to the form to do so via the link on the welcome page
or via `File`: `Open` menu button
and upload the saved file with `.rna2drawer2` extension.

<b><em>Opening a saved drawing from the first version of RNA2Drawer.</em></b>
Saved drawings from the first version of RNA2Drawer with `.rna2drawer` extension (missing the trailing "2") can also be opened,
though not all aspects of the drawing, namely the layout, will be preserved.
Clicking on the details toggle
will show a list of the drawing aspects that will be preserved.

## Tools

The different tools control how you interact with the drawing.
Information and options for the current tool are shown in the bottom-left corner,
which also allows switching between the different tools.

### The Dragging Tool

With the dragging tool,
stems can be dragged around circular loops and along flat loops.
The outermost loop may also be rotated using the dragging tool.
Additionally, stems in flattened inner loops can be dragged vertically
to adjust the height of the loop.

By default, unpaired bases that a stem is being dragged towards
are compressed.
This behavior can be turned off
by toggling the `Only Expand` option towards the bottom-left corner.

https://user-images.githubusercontent.com/28662629/177567629-6845bc75-13f8-4647-a2bc-348b813dbd09.mov

### The Pairing Tool

The pairing tool allows bases to be paired and unpaired
through the addition and removal of secondary and tertiary bonds.
To select a subsequence of bases,
click on a base and drag the mouse over the other bases
that you would like to select.
The selected bases will be highlighted in yellow.
Clicking on another subsequence of bases
will pair it with the selected bases.

If a pairing can be added to the secondary structure without forming a pseudoknot,
secondary bonds will be added to form the pairing.
Otherwise, tertiary bonds will be added to form the pairing.
If you only want to add tertiary bonds,
hold down `Shift` when clicking on the subsequence to pair with.

To unpair bases,
select the bases that you wish to unpair.
Clicking on the selected bases
will remove all secondary and tertiary bonds with these bases.
Alternatively, clicking on a secondary or tertiary bond
connected to the selected bases
will only remove the bond that was clicked on
and bonds that were stacked with the bond that was clicked on.

Additionally, by toggling the `Show Complements` option,
subsequences that are complementary to the selected subsequence
will be highlighted in pink,
making it easier to find pairing partners.

Parameters controlling the highlighting of complements
can be found in the `Complement Rules` form
accessible via the `Options` button next to the `Show Complements` toggle.

https://user-images.githubusercontent.com/28662629/177567712-9ccaf002-a914-4a3c-ba8b-42ba2ac3861c.mov

### The Flattening and Flipping Tools

When using the flattening tool,
clicking on a loop will flatten or unflatten it.
Note that hairpin loops cannot be flattened.

As shown below,
flattening a loop
changes how the stems in the loop can be dragged.
Notably, stems in a flat loop can be dragged vertically
to change the height of the loop.

<em>Flattening a loop with only one inner stem
will also keep the inner stem parallel with the outer stem of the loop.
This is an easy way to "straighten" loops
with only one inner stem.</em>

Using the flipping tool,
clicking on a stem or loop will flip it
over its bottommost base pair
(or for the outermost loop
will flip the entire drawing).

https://user-images.githubusercontent.com/28662629/177567767-d066eb89-b204-4543-9cf8-41c8b373edfc.mov

### The Editing Tool

The editing tool allows for changing the appearances of individual objects
(such as the colors and sizes of bases and bonds).

Objects may be selected by clicking on them
or by dragging the selecting box over them.
In the bottom-left corner is also a toggle
that controls the type of objects that are currently being selected and edited.

Once selected, a form will appear on the right side
with options for editing the object.

To deselect objects that you currently have selected,
click any empty part of the drawing.

https://user-images.githubusercontent.com/28662629/177567849-d684c6e3-21e0-448e-8249-ce47c2cc62e4.mov

## Line Drawings

Below is an example of a line drawing.

<p align="center" >
  <img src="./demo/lineDrawing.svg" width="600px" />
</p>

The following attributes give it the appearance of a line drawing.

&nbsp;&nbsp;&nbsp;&nbsp;Font size of `9` for bases.<br>
&nbsp;&nbsp;&nbsp;&nbsp;Line width of `9` and padding of `0` for primary bonds.<br>
&nbsp;&nbsp;&nbsp;&nbsp;An outline with radius of `4` and line width of `1` for all bases.<br>
&nbsp;&nbsp;&nbsp;&nbsp;All bases and primary bonds and the strokes and fills of all outlines have a color of `#999999`.

## Exporting Your Drawing

Drawings can be exported in SVG and PPTX formats.
SVG stands for scalable vector graphics
and SVG files may be opened with vector graphics editors
such as Adobe Illustrator and Inkscape.
PPTX is the file format of PowerPoint.

The forms to export drawings in SVG and PPTX formats
can be accessed via the `Export` dropdown.
In both forms,
the exported drawing can be scaled
by specifying a scaling factor.
For example, a scaling factor of 1 would result in no scaling of the exported drawing,
while a scaling factor of 2 would result in an exported drawing
that is double the size of what the drawing currently is in the app.

All elements of a drawing are exported as individual SVG and PPTX objects.
For example, bases are exported as text boxes
and primary and secondary bonds are exported as line objects.
This allows for further manipulation of the drawing
in vector graphics editors and PowerPoint.

## Frequently Asked Questions

<em>How do I delete a tertiary bond?</em>
While having the tertiary bond selected using the editing tool, press the `Delete` key.

<em>How do I rotate a drawing?</em>
The form to edit the layout
includes a `Rotation` field.
The form to edit the layout
can be accessed via the `Edit`: `Layout` menu button.

<em>How do I make colors transparent?</em>
When the transparency of a color can be set,
a text box will be present next to the color picker.
This text box controls the opacity of the color,
which is the opposite of transparency
(i.e., 100% opacity equals 0% transparency and vice versa).
By setting the opacity,
one can control transparency.

<em>How do I change the character of a base?</em>
Using the editing tool,
one can set the character of selected bases
via the character field in the right side form.

<em>How do I take a screenshot?</em>
The app itself is unable to take screenshots,
though most operating systems have built-in ways of taking screenshots
of the whole screen or just a portion of the screen,
such as the Snipping Tool on Windows.

<em>How do I create a line drawing?</em>
See section on [line drawings](#line-drawings)

<em>Is there an easy way to "straighten" loops with only one inner stem?</em>
Flattening loops with only one inner stem is a way to "straighten" them.
See section on the [flattening tool](#the-flattening-and-flipping-tools).

## Funding

This material is based upon work supported by the National Science Foundation Graduate Research Fellowship Program under Grant No. DGE 1840340.

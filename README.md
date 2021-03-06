# RNA2Drawer 2

A [web app](https://rna2drawer.app) for creating 2-D drawings of nucleic acid structures.
The layout, bonds and styling (e.g., colors and fonts) of a drawing
can all be easily customized within the app.
Drawings are exported in PPTX and SVG formats
such that all elements of a drawing (e.g., bases and bonds)
are exported as individual PPTX and SVG objects,
allowing for even further manipulation in PowerPoint and vector graphics editors such as Adobe Illustrator.

This project is a successor to the [first version](https://github.com/pzhaojohnson/RNA2Drawer#rna2drawer) of RNA2Drawer,
which was published in the journal <em>RNA Biology</em>.

&nbsp;&nbsp;&nbsp;&nbsp;<b>Article:</b> [https://doi.org/10.1080/15476286.2019.1659081](https://doi.org/10.1080/15476286.2019.1659081)
    
&nbsp;&nbsp;&nbsp;&nbsp;<b><em>If you use RNA2Drawer to draw structures in a publication, please cite the above article.</em></b>

If you have questions or experience issues, open an issue thread here on GitHub or email [help@rna2drawer.app](mailto:help@rna2drawer.app).
General comments and feature requests are also welcome!

<p align="center" >
  <img src="./demo/example1.svg" width="800px" />
</p>

&nbsp;&nbsp;&nbsp;&nbsp;[Creating a New Drawing](#creating-a-new-drawing)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Opening a Saved Drawing](#saving-a-drawing-and-opening-a-saved-drawing)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Saving a Drawing](#saving-a-drawing-and-opening-a-saved-drawing)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Modes](#modes)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Dragging Stems](#dragging-stems)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Pairing Bases](#pairing-bases)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Flattening Loops and Flipping Stems](#flattening-loops-and-flipping-stems)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Editing Bases](#editing-bases)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Editing Tertiary Bonds](#editing-tertiary-bonds)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Line Drawings](#line-drawings)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Exporting Your Drawing](#exporting-your-drawing)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Frequently Asked Questions](#frequently-asked-questions)<br>
&nbsp;&nbsp;&nbsp;&nbsp;[Funding](#funding)

## Creating a New Drawing

Open the form to create a new drawing via the link on the home page
or via the `File`: `New` menu button.
In the form,
enter the sequence and the ID of the sequence
for your new drawing.

The structure for your drawing may also be entered in dot-bracket notation.
This notation is commonly created by structure prediction programs
such as Mfold and RNAFold
and may be referred to as "Vienna" format.

Example inputs can be selected at the top of the form.
Parameters controlling how the sequence and structure are read in
can be shown via the toggles at the top right corners of the text boxes
for the sequence and structure.

## Saving a Drawing and Opening a Saved Drawing

Clicking the `File`: `Save` menu button will download a file with `.rna2drawer2` extension,
which contains a complete representation of your now saved drawing.
By default your web browser will place the file in your downloads folder,
though this can be changed in your browser settings.

To open a saved drawing,
navigate to the form to do so via the link on the home page
or via `File`: `Open` menu button
and upload the saved file with `.rna2drawer2` extension.

<b><em>Opening a saved drawing from the first version of RNA2Drawer.</em></b>
Saved drawings from the first version of RNA2Drawer with `.rna2drawer` extension (missing the trailing "2") can also be opened,
though not all aspects of a drawing, namely the layout, will be preserved.
When a drawing from the first version is uploaded,
a note will appear listing the aspects of the drawing that will be preserved.

## Modes

Modes control how you interact with the bases of a drawing.
Modes can be toggled on and off via the `Mode` dropdown.

### Dragging Stems

In the `Drag Stems` mode,
stems can be dragged around circular loops and along flat loops.
Additionally, stems in a flat loop can be dragged vertically
to adjust the height of the loop.

By default, the unpaired bases that a stem is being dragged towards
are compressed.
This behavior is turned off
in the `Drag Stems (Expand)` mode.

<p align="center" >
  <img src="./demo/dragging.gif" width="880px" />
</p>

### Pairing Bases

Bases can be paired and unpaired in the `Force Pair` mode.
To select a subsequence of bases,
click on a base and drag the mouse over the other bases
that you would like to select.
The selected bases will be highlighted in yellow.
Clicking on another subsequence of bases
will pair it with the selected bases.

If a pairing can be added to the secondary structure without forming knots,
secondary bonds will be created to form the pairing.
Otherwise, tertiary bonds will be created to form the pairing.
If you only want to create tertiary bonds,
turn on the `Add Tertiary Bonds` mode.

To remove secondary bonds,
select bases that are in secondary bonds
and click them again.
Bases will be highlighted in red
when clicking them will remove secondary bonds.
Note that secondary bonds cannot be removed
in the `Add Tertiary Bonds` mode.

Additionally, in the `Pair Complements` mode,
subsequences that are complementary to the selected subsequence
will be highlighted in blue,
making it easier to find pairing partners.
Clicking on a highlighted complement
will form the pairing.

Parameters controlling the highlighting of complements
can be customized in the `Complement Rules` form
accessible via the `Settings` dropdown.

<p align="center" >
  <img src="./demo/pairing.gif" width="880px" />
</p>

### Flattening Loops and Flipping Stems

In the `Flatten and Unflatten Loops` mode,
clicking on a loop will flatten or unflatten it.
Note that hairpin loops cannot be flattened.

As shown below,
flattening a loop
changes how the stems in the loop can be dragged.
Notably, stems in a flat loop can be dragged vertically
to change the height of the loop.

<em>Flattening a loop with only one inner stem
will also keep the inner stem parallel to the outer stem of the loop.
This is an easy way to "straighten" loops
with only one inner stem.</em>

In the `Flip Stems` mode,
clicking on a stem will flip it
over its bottommost base pair.

<p align="center" >
  <img src="./demo/flatteningAndFlipping.gif" width="880px" />
</p>

### Editing Bases

In the `Edit Bases` mode, clicking on a base will select it
and clicking on other bases will add them to your selection.
Multiple bases can be selected at once by clicking on a base
and dragging the mouse over other bases.

To unselect bases, click anywhere on the drawing that is not a base.
Clicking on a selected base will also unselect that individual base.

Turning on this mode will open the form to edit bases.
To reopen this form if it has been closed,
select a base and the form will be reopened.

In the form,
you can set the colors of bases
and add and remove outlines from them.
The outlines of bases can also be edited in this form.

Additionally, when only one base is selected,
the character of the base can be set.

<p align="center" >
  <img src="./demo/editingBases.gif" width="880px" />
</p>

## Editing Tertiary Bonds

Clicking on a tertiary bond will select it.
Multiple tertiary bonds can be selected
by clicking on them in succession.
To unselect tertiary bonds,
click anywhere on the drawing that is not a tertiary bond.

To adjust the curve of a tertiary bond,
click on the tertiary bond and drag the mouse.

Double-clicking a tertiary bond
will open the form to edit tertiary bonds.
This form can also be opened
via the `Edit`: `Tertiary Bonds` menu button.
In the form,
the colors of tertiary bonds can be set
along with other parameters
such as line width and base paddings.

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
by setting the font size of bases in the exported drawing.
All other elements are scaled to match the font size of bases in the exported drawing.

All elements of a drawing are exported as individual SVG and PPTX objects.
For example, bases are exported as text boxes
and primary and secondary bonds are exported as line objects.
This allows for further manipulation of the drawing
in vector graphics editors and PowerPoint.

## Frequently Asked Questions

<em>How do I delete a tertiary bond?</em>
When selecting a tertiary bond, press the `Delete` key.

<em>How do I rotate a drawing?</em>
The form to edit the layout
includes a `Rotation` field.
The form to edit the layout
can be accessed via the `Edit`: `Layout` menu button.

<em>How do I make colors transparent?</em>
When it is possible to set the transparency of a color,
the color picker will include a slider and an "A" field
that allow you to set the opacity of a color.
Opacity is the opposite of transparency,
so an opacity of zero corresponds to 100% transparency,
and vice versa.

<em>How do I change the character of a base?</em>
In the editing bases mode,
when only one base is selected,
the character of the base can be set.
See section on the [editing bases mode](#editing-bases).

<em>How many undos and redos are possible?</em>
Up to 60 undos and 60 redos are possible.

<em>How do I take a screenshot?</em>
The app itself cannot take screenshots,
though most operating systems have apps for taking screenshots
of the whole screen or just a portion of the screen,
such as the Snipping Tool on Windows.

<em>How do I create a line drawing?</em>
See section on [line drawings](#line-drawings)

<em>Is there an easy way to "straighten" loops with only one inner stem?</em>
Flattening loops with only one inner stem effectively "straightens" them.
See section on the [flattening loops mode](#flattening-loops-and-flipping-stems).

## Funding

This material is based upon work supported by the National Science Foundation Graduate Research Fellowship Program under Grant No. DGE 1840340.

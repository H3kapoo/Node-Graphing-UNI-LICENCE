## ```Flow```
### ```Main Flow```
<details>

<summary>Click to open</summary>
  
![Imgur Image](https://i.imgur.com/cw49fGl.png)
  
</details>


### ```Details about the flow```
<details>

<summary>Click to open</summary>

```0.```&#32;For example, the user might input the following command in order to update the color of node ```0``` to the color ```blue```:
```cs
CLI$> node.update -id 1 -color blue
```

```1.```&#32;After pressing ```enter key```, the ```GraphManager``` will ask ```CLIManager``` for the inputed command string and return it to ```GraphManager``` <br/>

```2.```&#32;```GraphManager``` will then pass the command string to the ```CommandParser``` to be parsed into tokens. <br/>

```3.```&#32;The ```CommandParser``` will verify against the known supported commands found in ```CommandsSchema``` file if the user passed command exists. If the command doesn't exist, the process finishes with visible error in the terminal.If the commands exists, the parser will further verify if: all options of the command have a valid argument (if they require one), all mandatory options are filled in and if the option passed exists in the command schema. <br/>

```4.```&#32; After the verification is complete, a state change object is generated based on the user command and returned to the ```GraphManager```. In this example it should look something like this:
```javascript
{
   "cmdName":"nodeUpdate",
   "-id":[0],
   "-color":["blue"]
}
```
```NOTE:```  The reason why <i>id</i> and <i>color</i> are vectors will be addressed later on.

```5.```&#32; ```GraphManager``` tells ```CLIManager``` to flush the user inputed command from the screen. <br/>
```6.```&#32; ```GraphManager``` passes the above parsed object block along with the currently bound ```StateManager``` object to the ```CommandProcessor``` to be further validated and applied.

```7.```&#32; ```CommandProcessor``` will verify against the known supported command logic available in the ```CommandsLogic``` file to see if there is a logical definition of the above command. If the command doesn't exist, the process finishes with visible error in the terminal. If the command exists however, the ```CommandProcessor``` will call that command's logic passing in as arguments the parsed object block and the previously talked about  ```StateManager```.

```8.```&#32; Control will then flow thru the code logic of that command. In this example, the command's logic will call ```StateManager```'s ```pushUpdateNode({changeObj})``` that will push to the ```StateManager``` a command to be executed.

```9.```&#32; Before any ```push``` command is actually executed on the ```state``` , ```StateManager``` will validate with the internally supported options for nodes/connections found in ```StateSupport``` file if the passed options are valid.If they are not valid, errors will bubble up to the terminal, terminating. If there are no errors, the code logic of that command will call ```executePushed()``` that will finally apply all the ququed ```push``` commands to the bound state. Control leaves the command logic scope.

```10.```&#32; Next up, ```GraphManager``` calls the render method on ```GraphRenderer``` (passing in the ```StateManager``` object) that will render the nodes and connections according to the state stored in the ```StateManager```.

```11.``` &#32; DONE until ```enter key``` pressed again :) => ```0.```

</details>

## ```Command File Anatomy```

### Background
Each command will be picked up by the app at start-up or when the user clicks the ```refresh commands``` option from the menu dropdowns. This will load all the command's in the app's memory from the ```path/from/where/to/load``` directory ready to be ran. <br/> By making them individual files has the advantage of easy distribution of custom commands to other users and the ability to only load/unload necessary commands. <br/>
Every command file is one big JSON like object written in the ```.js``` extension consisting of two core parts:
<ol>
  <li>command schema</li>
  <li>command logic</li>
</ol>

A quick boilerplate example of an empty command file structure:

```javascript
//dummyExample.js
data = {
    "schema": {
        ...
    },
    "logic": {
        ...
    }
}
```

```Note:``` The main encapsulating object name always needs to be called ```data``` like in the above example. All the necessary code that goes into ```"schema"``` and ```"logic"``` will be discussed in their unique sections bellow.

### Command Schema
The command schema is used by the parsing stage to make sure the user inputted the right options with their according parameters as the creator of the command intended. The schema is the first user validation stage the inputted command goes thru.
#### Layout of schema
The command schema will always be composed of 2.5 main things: 
<ol>
  <li>the name of the command</li>
  <li>an array containing some mandatory parameters that the user is forced to input</li>
  <li>the options themselves with the corresponding argument type (optional) </li>
</ol>
Should look something like this:

```javascript
{
    "name": 'command.name.here',
    "mandatory": ["mandatory.options.strings.here.comma.separated"],
    "-option.name": "argument.type.for.option",
    //other options...
}
```
#### Types for arguments
Wether it is an internal command or a user defined one, the option's argument of a schema has to have a type, here are some that are available now:
```aida
oneDimStringVec = a,b,c,d,...            (simple vector of comma separated strings)
oneDimIntVec    = 1,2,5,7,...            (simple vector of comma separated ints)
twoDimIntVecs   = 1,2 OR 1,2|5,6|5,9|... (vector of vectors containing strictly two ints)
nDimIntVecs     = 1,4,6|4|1,5|...        (vector of vectors each containing arbitrary many ints)
```
```Note:``` The ```|``` symbol is used for the vector of vectors types to basically "define" the start of another vector group. Groups can be useful later on when working with the command's logic.

The ```Parser``` will spit diferent formats for the option depending on the argument type. Example:
```aida
arg type is: ends_in_Vec  => [simple,comma,separated,data,vector] => [..]
arg type is: ends_in_Vecs => [[multiple,comma,separated],[comma,separated,arrays]] => [[..],[..]]
```
### Example of a schema
```Note:``` All presented command examples are just EXAMPLES of how the command might work in production, don't take the behaviour for granted. <br/>
```Naming Note 1:``` As a good practice, if your command name has "multiple words" in it, separate them by a ```dot``` and not by ```doingThis``` or ```doing_this```,  although you're not forced to adhere to this good practice. <br/>
```Naming Note 2:``` If the commands act on nodes, it is a good and intuitive practice to name the command starting with ```node.``` + the name of the command. Same logic applies to the connections or whatever else the user decides to introduce (namespacing concept). <br/> <br/>
A simple example of a schema of the command that let's the user change the color and radius of multiple node ids at once. The node's radius is not required for this command but the color and id option however are mandatory and the parser will throw an error if not inputted:

```javascript
//CLI$> node.change -id 3,5 -color red -radius 30
{
    "name": 'node.change',
    "mandatory": ["-id","-color"],
    "-id: : "oneDimIntVec",
    "-color": "oneDimStringVec",
    "-radius": "oneDimIntVec"
}
    //the above tokenizes in:
{
   "cmdName":"nodeChange",
   "-id": [3,5],
   "-color":["red"],
   "-radius":[30]
}
```
A more complicated example that uses the 'vecs' argument type to accept multiple groups of node ids and apply a color to each node id group:

```javascript
//CLI$> node.change -id 1,2|3,4 -color red -radius 30
{
    "name": 'node.change',
    "mandatory": ["-color"],
    "-color": "oneDimStringVec",
    "-radius": "oneDimIntVec"
}
    //the above tokenizes in:
{
   "cmdName":"nodeChange",
   "-id": [[1,2],[3,4]]
   "-color":["red"],
   "-radius":[30]
}
```

Example of a command that doesnt require anything from the user to run it's logic:
```javascript
//CLI$> node.nothing
{
    "name": 'node.nothing',
    "mandatory": []
}

    //the above tokenizes in:
{
   "cmdName":"nodeNothing",
}
```


## Internals mix
### Internally defined commands
  
  <details>

<summary>Click to open</summary>
  
As of ```22-08-2021```, there are exactly ```3``` internally defined commands by the application itself:

| command | mandatory | optional | description |
|---|---|---|---|
| ```node.make``` | ```pos<twoDimIntVecs>```| ```type<oneDimStringVec>``` | Creates group of nodes at given positions that are round by default.Type option can be used to change node appearance. |
| ```node.update``` | ```id<oneDimIntVec>```  | ```color<oneDimStringVec``` <br/> ```radius<oneDimIntVec>```  | Updates the targeted node ids with the specified options. |
| ```node.delete``` | ```id<oneDimIntVec>``` | ```None``` | Deletes the targeted nodes. |
  
    
  
</details>

  
### ```Internally supported options + types for nodes & connections```
```javascript
//nodes
{
    "-radius": { 'active': true, 'type': 'integer' },
    "-pos": { 'active': true, 'type': 'intPairVec' },
    "-color": { 'active': true, 'type': 'string' },
    "-node_id": { 'active': true, 'type': 'integer' },
    "-type": { 'active': true, 'type': 'integer' },
    "-id": { 'active': true, 'type': 'integer' },
}
//connections
{
    "-color": { 'active': true, 'type': 'string' },
}
```












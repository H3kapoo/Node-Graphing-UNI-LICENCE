## ```Flow```
### ```Main Flow```
<details>

<summary>Click to open</summary>
  
![Imgur Image](https://i.imgur.com/cw49fGl.png)
  
</details>

### ```Details about the flow```

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
   "-id":[[0]],
   "-color":["blue"]
}
```
```NOTE:```  The reason why <i>id</i> and <i>color</i> are a vector of vectors and a vector respectively, will be addressed later on.

```5.```&#32; ```GraphManager``` tells ```CLIManager``` to flush the user inputed command from the screen. <br/>
```6.```&#32; ```GraphManager``` passes the above parsed object block along with the currently bound ```StateManager``` object to the ```CommandProcessor``` to be further validated and applied.

```7.```&#32; ```CommandProcessor``` will verify against the known supported command logic available in the ```CommandsLogic``` file to see if there is a logical definition of the above command. If the command doesn't exist, the process finishes with visible error in the terminal. If the command exists however, the ```CommandProcessor``` will call that command's logic passing in as arguments the parsed object block and the previously talked about  ```StateManager```.

```8.```&#32; Control will then flow thru the code logic of that command. In this example, the command's logic will call ```StateManager```'s ```pushUpdateNode({changeObj})``` that will push to the ```StateManager``` a command to be executed.

```9.```&#32; Before any ```push``` command is actually executed on the ```state``` , ```StateManager``` will validate with the internally supported options for nodes/connections found in ```StateSupport``` file if the passed options are valid.If they are not valid, errors will bubble up to the terminal, terminating. If there are no errors, the code logic of that command will call ```executePushed()``` that will finally apply all the ququed ```push``` commands to the bound state. Control leaves the command logic scope.

```10.```&#32; Next up, ```GraphManager``` calls the render method on ```GraphRenderer``` (passing in the ```StateManager``` object) that will render the nodes and connections according to the state stored in the ```StateManager```.

```11.``` &#32; DONE until ```enter key``` pressed again :) => ```0.```

## Mix for now..
### Command Schema
#### Layouf of schema
The command schema will always be composed of 3 main things: The name of the command, an array containing some mandatory parameters that the user needs to input and finally the options themselves with the corresponding argument type:
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












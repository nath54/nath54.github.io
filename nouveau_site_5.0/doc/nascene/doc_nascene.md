# NaScene

NaScene is a generic visual novel engine system.
The system is designed in a way most of the errors can be detected at compile time.
The website will use the NaScene system to use with the Museum.

## Data files

There will be a NaScene interpreter integrated into the PyXML system.
You will have to use the node `<nascene scene_data="path/to/scene/manifest.json">` to include a scene into the website. In general, you don't put much other things in the same page than the nascene node, because the nascene node will take the full width and height of the page.

The dirpath of the nascene manifest will be designated as the `nascene_root`.
All paths in the manifest or in the nascene files must start with a keyword, either `nascene_root`, or `local`.

- `nascene_root`: the path is relative to the `nascene_root`.
- `local`: the path is relative to the current nascene file.

Example:

`add_image(id=1, src="nascene_root:/scene_1/image.png", position="0 0", size="100% 100%", opacity="1")`

`add_image(id=2, src="local:/image.png", position="0 0", size="100% 100%", opacity="1")`

## Scenes

Inside a `.nascene` file, you define **scenes** with the scene_id followed by `:` and then teh commands list inside the scene, example:

```
scene_1:
  add_image(id=1, src="nascene_root:/scene_1/image.png", position="0 0", size="100% 100%", opacity="1")
  add_text(id=2, text="Hello wanderer !", position="0 0", size="100% 100%", opacity="1")
  add_button(id=3, text="Click me", position="0 0", size="100% 100%", opacity="1")
```

Scenes are like functions. But more like in an assembly language, you only have one indent level. You can't nest code for conditions or loops, instead you put nested code in other scenes that you can call with the special rooting commands.

## Comments

Inline comments start with `#` and go until the end of the line.

Example:

```
my_scene:
    # This is a comment
    add_image(id=1, src="nascene_root:/scene_1/image.png", position="0 0", size="100% 100%", opacity="1")
```

There are no multiline comments. You have to begin each commented line with `#`.

## Commands

Commands are like assembly instructions, they are executed line by line. Each command don't return anything, and don't have any side effects other than what is explicitly stated.
All variables manipulations are explicitely typed, allowing to detect errors at compile time, and reduce the risk of runtime errors.
When you use a command, you must write each argument, their are no default values. If not done correctly, this will lead to a compile time error. Also, when you write an argument value, you must use the syntax `command(..., arg_name="arg_value", ...)`.
In string values, you can use `"... $var_name ..."` to insert the value of a variable. **Warning:** You can only render like that variables of the types: `str`, `int`, `float`, `bool`. If you try to render a variable of another type, it will lead to a compile time error.
Because all arguments are explicitely named, you don't need to write them in the order they are defined.
You don't have  to write the whole command in one line, you can write it in multiple lines, but you must close the parentheses.

Example:

```
my_scene:
    # ...
    add_image(
        id=1,
        src="nascene_root:/scene_1/image.png",
        position="0 0",
        size="100% 100%",
        opacity="1"
    )
```

### The variables system

All variables are explicitely typed and global.

They can have the following types:

Base types:
- `str`: string
- `int`: integer
- `float`: float
- `bool`: boolean

Non-base types:
- `list[<base-type>]`: list of <base-type>, index start at 0, and are modulo the length of the list.
- `dict[str | int, <base-type>]`: dictionary of <base-type>, keys can be strings or integers.

You can't mix values types in a list, or dictionary.

### The element system

All elements have an `id` (int), a `position_and_size` (str), and an `opacity` (str).
Depending on their types, they will have other arguments too.

You can't create two elements with the same id.

### The element position system

The nascene engine generaly assigns a 2D canvas as the `screen`.
The screen size is responsive and may vary depending on the device or the place it is contained in.
All elements are positioned into a normalized 2D space, where the top-left corner is (0, 0) and the bottom-right corner is (1, 1).

TODO: centering, covering, croping, scaling, rotation, screen ratio / orientation conditions, ...

### Elements modification related commands

- `clear`: Clear the screen and destroy all objects. No arguments.
- `remove`: Remove an element by its id.
    - `id` (int): The id of the element to remove.
- `update_element_str_attribute`: Update an element's string attribute.
    - `id` (int): The id of the element to update.
    - `attribute` (str): The attribute to update.
    - `value` (str): The new value of the attribute.
- `update_element_int_attribute`: Update an element's integer attribute.
    - `id` (int): The id of the element to update.
    - `attribute` (str): The attribute to update.
    - `value` (int): The new value of the attribute.
- `update_element_float_attribute`: Update an element's float attribute.
    - `id` (int): The id of the element to update.
    - `attribute` (str): The attribute to update.
    - `value` (float): The new value of the attribute.
- `update_element_bool_attribute`: Update an element's boolean attribute.
    - `id` (int): The id of the element to update.
    - `attribute` (str): The attribute to update.
    - `value` (bool): The new value of the attribute.
- `disable_element`: Disable an element (like a button or a text input).
    - `id` (int): The id of the element to disable.
- `enable_element`: Enable an element (like a button or a text input).
    - `id` (int): The id of the element to enable.

### Elements creation related commands

You can use the default low level graphical elements:

- `add_image`: Add an image element to the screen.
    - `id` (int): The id of the image.
    - `src` (str): The source of the image.
    - `position_and_size` (str): The position and size of the image.
    - `opacity` (str): The opacity of the image.
- `add_text`: Add a text element to the screen. The text is rendered in a container. If some text characters exceed the container size, they can be hidden.
    - `id` (int): The id of the text.
    - `text` (str): The text to add. The text supports beautiful text formatting syntax, allowing to add effects.
    - `position_and_size` (str): The position and size of the text container.
    - `opacity` (str): The opacity of the text.
    - `color` (str): The color of the text.
    - `font_size` (int): The font size of the text.
    - `align_v` (str): The vertical alignment of the text container (`top`, `center`, `bottom`).
    - `align_h` (str): The horizontal alignment of the text container (`left`, `center`, `right`).
    - `wrap` (bool): Whether the text should wrap or not.
    - `overflow` (str): What to do when the text exceeds the container size (`hidden`, `scroll`, `visible`).
- `add_button`: Add a button to the screen.
    - `id` (int): The id of the button.
    - `text` (str): The text of the button.
    - `position_and_size` (str): The position and size of the button.
    - `opacity` (str): The opacity of the button.
    - `color` (str): The color of the button.
    - `font_size` (int): The font size of the button.
    - `on_clicked` (str): The scene to call when the button is clicked.
- `add_text_input`: Add a text input to the screen.
    - `id` (int): The id of the text input.
    - `text` (str): The text of the text input.
    - `position_and_size` (str): The position and size of the text input.
    - `opacity` (str): The opacity of the text input.
    - `color` (str): The color of the text input.
    - `font_size` (int): The font size of the text input.
    - `on_validated` (str): The scene to call when the text input is validated.

But because this is a visual novel engine, you can also use higher level commands for the text bar of the VN:

- `bar_show`: Show the text bar. No arguments.
- `bar_hide`: Hide the text bar. No arguments.
- `bar_clear`: Clear the elements of the text bar. No arguments.
- `bar_append_text`: Append text to the text bar.
    - `text` (str): The text to append.
- `bar_append_input`: Append a text input to the text bar.
    - `on_validated` (str): The scene to call when the text input is validated.
- `bar_append_choice`: Append a choice to the text bar.
    - `options` (list[str]): The options of the choice.
    - `on_validated` (str): The scene to call when the choice is validated.
- `bar_set_name`: Set the name of the character speaking.
    - `name` (str): The name of the character speaking.
- `bar_clear_name`: Clear the name of the character speaking. No arguments.
- `bar_set_sprite`: Set the sprite of the character speaking.
    - `src` (str): The source of the sprite.
- `bar_clear_sprite`: Clear the sprite of the character speaking. No arguments.

### Variables related commands

#### Local storage

- `save_var`: Save a variable to a local storage.
    - `var_name` (str): The name of the variable.
    - `type` (str): The type of the variable.
- `load_var`: Load a variable from a local storage.
    - `var_name` (str): The name of the variable.
    - `type` (str): The type of the variable.
    - `default_value` (str): The default value of the variable if not found in local storage.
- `clear_var`: Clear a variable from a local storage.
    - `var_name` (str): The name of the variable.

#### Base type variables

- `set_var_int`: Set an integer variable. Update the value or creates it if it doesn't exist.
    - `var_name` (str): The name of the variable.
    - `value` (int): The value of the variable.
- `set_var_float`: Set a float variable. Update the value or creates it if it doesn't exist.
    - `var_name` (str): The name of the variable.
    - `value` (float): The value of the variable.
- `set_var_str`: Set a string variable. Update the value or creates it if it doesn't exist.
    - `var_name` (str): The name of the variable.
    - `value` (str): The value of the variable.
- `set_var_bool`: Set a boolean variable. Update the value or creates it if it doesn't exist.
    - `var_name` (str): The name of the variable.
    - `value` (bool): The value of the variable.

#### String manipulation

- `str_len`: Get the length of a string variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be an integer.)
- `str_concat`: Concatenate two string variables.
    - `var_name1` (str): The name of the first variable.
    - `var_name2` (str): The name of the second variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a string.)
- `str_substring`: Get a substring of a string variable.
    - `var_name` (str): The name of the variable.
    - `start_index` (int): The starting index of the substring.
    - `end_index` (int): The ending index of the substring.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a string.)

#### Base types conversion

- `str_to_int`: Convert a string variable to an integer variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be an integer.)
- `str_to_float`: Convert a string variable to a float variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a float.)
- `str_to_bool`: Convert a string variable to a boolean variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a boolean.)
- `int_to_str`: Convert an integer variable to a string variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a string.)
- `float_to_str`: Convert a float variable to a string variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a string.)
- `bool_to_str`: Convert a boolean variable to a string variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a string.)
- `int_to_float`: Convert an integer variable to a float variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a float.)
- `float_to_int`: Convert a float variable to an integer variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be an integer.)
- `bool_to_int`: Convert a boolean variable to an integer variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be an integer.)
- `bool_to_float`: Convert a boolean variable to a float variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a float.)
- `int_to_bool`: Convert an integer variable to a boolean variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a boolean.)
    - `threshold` (int): The threshold to convert the integer to a boolean. (If the value is greater than the threshold, it will be converted to True, otherwise to False.)
- `float_to_bool`: Convert a float variable to a boolean variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a boolean.)
    - `threshold` (float): The threshold to convert the float to a boolean. (If the value is greater than the threshold, it will be converted to True, otherwise to False.)

#### Math operations

The input variables must have the same type, and the output variable must have the type of the input variables if already existing.

- `add`: Add two variables.
    - `var_name1` (str): The name of the first variable.
    - `var_name2` (str): The name of the second variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `sub`: Subtract two variables.
    - `var_name1` (str): The name of the first variable.
    - `var_name2` (str): The name of the second variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `mul`: Multiply two variables.
    - `var_name1` (str): The name of the first variable.
    - `var_name2` (str): The name of the second variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `div`: Divide two variables. If division by zero occurs, the result will be set to 0.
    - `var_name1` (str): The name of the first variable.
    - `var_name2` (str): The name of the second variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `pow`: Raise a variable to the power of another variable. If the exponent is negative, the result will be set to 0.
    - `var_name1` (str): The name of the first variable.
    - `var_name2` (str): The name of the second variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `sqrt`: Calculate the square root of a variable. If the variable is negative, the result will be set to 0.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `abs`: Calculate the absolute value of a variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `min`: Get the minimum of two variables.
    - `var_name1` (str): The name of the first variable.
    - `var_name2` (str): The name of the second variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `max`: Get the maximum of two variables.
    - `var_name1` (str): The name of the first variable.
    - `var_name2` (str): The name of the second variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `round`: Round a variable to the nearest integer.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `floor`: Floor a variable to the nearest integer.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `ceil`: Ceil a variable to the nearest integer.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `neg`: Negate a variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)

#### List variables

- `init_var_list`: Initialize a list variable.
    - `var_name` (str): The name of the variable.
    - `type` (str): The type of the elements of the list.
    - `initial_value` (list[str]): The initial value of the variable.
- `append_to_var_list`: Append an element to a list variable.
    - `var_name` (str): The name of the variable.
    - `value` (str): The value to append.
- `get_from_var_list`: Get an element from a list variable.
    - `var_name` (str): The name of the variable.
    - `index` (int): The index of the element to get.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)
- `get_var_list_length`: Get the length of a list variable.
    - `var_name` (str): The name of the variable.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be an integer.)
- `remove_from_var_list`: Remove an element from a list variable.
    - `var_name` (str): The name of the variable.
    - `index` (int): The index of the element to remove.
- `get_index_of_var_list`: Get the index of an element in a list variable. If the element is not found, the variable will be set to -1.
    - `var_name` (str): The name of the variable.
    - `value` (str): The value to get the index of.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be an integer.)
- `is_in_var_list`: Check if an element is in a list variable.
    - `var_name` (str): The name of the variable.
    - `value` (str): The value to check.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must be a boolean.)
- `clear_var_list`: Clear a list variable.
    - `var_name` (str): The name of the variable.
- `get_sublist`: Get a sublist from a list variable.
    - `var_name` (str): The name of the variable.
    - `start_index` (int): The starting index of the sublist.
    - `end_index` (int): The ending index of the sublist.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the elements of the list.)

#### Dictionary variables

- `init_var_dict`: Initialize a dictionary variable.
    - `var_name` (str): The name of the variable.
    - `key_type` (str): The type of the keys of the dictionary.
    - `value_type` (str): The type of the values of the dictionary.
    - `initial_value` (dict[str, str]): The initial value of the variable.
- `set_var_dict_value`: Set a value in a dictionary variable.
    - `var_name` (str): The name of the variable.
    - `key` (str): The key to set.
    - `value` (str): The value to set.
- `get_var_dict_value`: Get a value from a dictionary variable.
    - `var_name` (str): The name of the variable.
    - `key` (str): The key to get.
    - `result_var_name` (str): The name of the variable to store the result in. (If the variable already exists, it must have the same type as the values of the dictionary.)
- `remove_from_var_dict`: Remove a value from a dictionary variable.
    - `var_name` (str): The name of the variable.
    - `key` (str): The key to remove.

### Branching

If a "scene_name" argument is empty (`""`), nothing will be played and we just go to the next instruction line.
If a "scene_name" argument is not empty and doesn't exists, it will raise an error at compile time.

- `if`: If a condition is true, execute a block of code.
    - `cond_var_name` (bool): The variable containing the condition to check.
    - `true_scene_name` (str): The name of the scene to play if the condition is true.
    - `false_scene_name` (str): The name of the scene to play if the condition is false.

### Loops

- `while`: While a condition is true, execute a block of code.
    - `cond_var_name` (bool): The variable containing the condition to check.
    - `scene_name` (str): The name of the scene to play if the condition is true.
- `foreach`: For each element in a list, execute a block of code.
    - `list_var_name` (str): The name of the list variable.
    - `element_var_name` (str): The name of the variable to store the element in.
    - `scene_name` (str): The name of the scene to play for each element.
- `for_range`: For each integer in a range, execute a block of code.
    - `start` (int): The starting integer.
    - `end` (int): The ending integer.
    - `step` (int): The step.
    - `index_var_name` (str): The name of the variable to store the index in. (If the variable already exists, it must be an integer.)
    - `scene_name` (str): The name of the scene to play for each integer.

### Custom events

- `pause`: Pause the execution, and wait for an event like a mouse click or a space bar press.
- `end`: End the execution of the NaScene.

- `unregister_event`: Unregister an event.
    - `event_register_id` (int): The ID of the event to unregister.

- `register_mouse_click`: Register a mouse click event. This event is triggered when the mouse is clicked, the position of the mouse is stored in the `mouse_x` and `mouse_y` variables.
    - `event_register_id` (int)
    - `scene_name` (str): The name of the scene to play when the mouse is clicked.

- `register_key_press`: Register a key press event. This event is triggered when a key is pressed, the key is stored in the `key` variable.
    - `event_register_id` (int)
    - `scene_name` (str): The name of the scene to play when a key is pressed.

- `register_key_release`: Register a key release event. This event is triggered when a key is released, the key is stored in the `key` variable.
    - `event_register_id` (int)
    - `scene_name` (str): The name of the scene to play when a key is released.

### Audio

- `play_audio`: Play an audio file.
    - `audio_file` (str): The path to the audio file.
    - `loop` (bool): Whether to loop the audio file.
    - `volume` (float): The volume of the audio file.

- `pause_audio`: Pause the audio.

- `resume_audio`: Resume the audio.

- `stop_audio`: Stop the audio.

- `set_audio_volume`: Set the volume of the audio.
    - `volume` (float): The volume of the audio.

- `play_sfx`: Play a sound effect.
    - `sfx_file` (str): The path to the sound effect file.
    - `volume` (float): The volume of the sound effect.

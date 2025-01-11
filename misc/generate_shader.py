import json
import re
import os

SHADERS_FOLDER = "lib/shaders"
FRAG_SHADERS_FOLDER = f"{SHADERS_FOLDER}/frag"

EDITABLE_UNIFORMS_FILE = "editable-uniforms.ts"
EDITABLE_UNIFORMS_PREFIX = "export const editableUniforms: SlidersOptionsMap = "

SHADER_NAME = "swirl"

RENAME_UNIFORMS_AS_CONSTS = True

def camel_case_split(identifier):  # https://stackoverflow.com/a/29920015
    matches = re.finditer(r'.+?(?:(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|$)', identifier)
    return [m.group(0) for m in matches]

# Get the user-editable uniforms of the shader
with open(os.path.join(FRAG_SHADERS_FOLDER, SHADER_NAME, f"{SHADER_NAME}-modifiable.frag"), "r") as f:
    shader_contents = f.read()
    uniform_matches = list(re.finditer(r"uniform\s\w+\s(?P<uniform_name>u\w+);", shader_contents))

    uniforms = [match.group("uniform_name") for match in uniform_matches]


# Get all editable uniforms' values
with open(os.path.join(FRAG_SHADERS_FOLDER, SHADER_NAME, EDITABLE_UNIFORMS_FILE), "r") as f:
    # Get editable uniforms text block
    contents = f.read()
    editable_uniforms_start = contents.find(EDITABLE_UNIFORMS_PREFIX) + len(EDITABLE_UNIFORMS_PREFIX)
    editable_uniforms_contents = contents.strip()[editable_uniforms_start:-1]  # Remove trailing semicolon

    # Format it to be JSON readable
    editable_uniforms_contents= re.sub(r"\s(?P<property>\w+?):", r' "\1":', editable_uniforms_contents)
    editable_uniforms_contents = re.sub(r",\n}$", r"}", editable_uniforms_contents)

    # Convert to JSON
    editable_uniforms = json.loads(editable_uniforms_contents)


# Get the uniforms' values
uniform_values = {}
for uniform in uniforms:
    raw_value = editable_uniforms[uniform]["value"]

    if isinstance(raw_value, bool):
        value = "true" if raw_value else "false"
    elif isinstance(raw_value, list):
        # Need to be a 'vector'
        value = f"vec{len(raw_value)}({', '.join(map(str, raw_value))})"
    else:
        value = raw_value
    
    uniform_values[uniform]=value

# Update the original shader to use these values
shader_lines = shader_contents.split("\n")
for i, line in enumerate(shader_lines):
    # This isn't particularly efficient, but whatever
    for match in uniform_matches:
        uniform = match.group("uniform_name")
        match_string=match.group()
        if match_string in line:
            line = line.replace(match_string, f"#define {uniform} {uniform_values[uniform]}")
    shader_lines[i] = line

shader_contents = "\n".join(shader_lines)

if RENAME_UNIFORMS_AS_CONSTS:
    for uniform in uniforms:
        new_uniform = "_".join([part.upper() for part in camel_case_split(uniform[1:])])
        shader_contents = shader_contents.replace(uniform, new_uniform)
        print(new_uniform)

# Write to file
with open(os.path.join(FRAG_SHADERS_FOLDER, SHADER_NAME, f"{SHADER_NAME}-fixed.frag"), "w") as f:
    f.write(shader_contents)

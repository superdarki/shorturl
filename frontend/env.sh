#!/bin/bash

# Check for environment argument
ENVIRONMENT="$1"

# Determine the path for runtime-env.js based on the environment
if [ "$ENVIRONMENT" == "prod" ]; then
    OUTPUT_PATH="./runtime-env.js"
else
    OUTPUT_PATH="./public/runtime-env.js"
fi

# Recreate config file
rm -f "$OUTPUT_PATH"
touch "$OUTPUT_PATH"

# Add assignment
{
    echo "window = window || {};"; 
    echo "window._env_ = {";
} >> "$OUTPUT_PATH"

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}

  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> "$OUTPUT_PATH"
done < .env

# Close the JS object
echo "};" >> "$OUTPUT_PATH"

echo "Configuration file created at $OUTPUT_PATH"
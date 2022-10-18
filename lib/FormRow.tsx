import { Box, ResponsiveContext, TextArea, TextInput, Text } from "grommet";
import { useContext, useMemo } from "react";

function ucFirst(string: string) {
  return string.split(/\s+/g)
    .map((str) => {
      return str.substring(0, 1).toUpperCase() + string.substring(1)
    }).join(' ')
}

export default ({ leaf, name, value, validator, prompt = '', notes = '', type = 'text' }) => {

  const updateValue = (e) => leaf.set(name, e.target.value);
  let Field = TextInput;
  switch (type) {
    case 'textarea':
      Field = TextArea;
      break;
  }
  const input = <Field value={value} name={name} onChange={updateValue}/>
  const size = useContext(ResponsiveContext);
  let labelSize = '12rem';
  let notesSize = 'medium';
  let inputSize ='large';
  let fieldOrientation = 'row';
  let gap ='medium';

  switch (size) {
    case 'small':
      labelSize = '';
      notesSize = '';
      inputSize = '';
      fieldOrientation = 'column';
      gap = '';
      break;

    case 'medium':
      notesSize = 'small';
      break;
  }

  const vrTest = useMemo(() => {
    if (Array.isArray(validator)) {
      const [min, max] = validator;
      return (string) => {
        if ((min && string.length < min)) {
          return false;
        }
        if (max && (string.length > max)) {
          return false;
        }
        return true;
      }
    }
    return validator;
  }, [validator])

  const dPrompt = useMemo(() => {
    if (value === '') return false;
    if (!vrTest || vrTest(value)) return false;

    if (Array.isArray(validator)) {
      return name + `must be${validator.map((term, index) => {
        if (!term) return '';
        switch (index) {
          case 0:
            return `at least ${term} letters`;
            break;

          case 1:
            return `no greater than ${term} lettters`;
            break;
        }
        return '';
      }).filter(n => n).join(' and ')}`
    }

    return prompt || 'invalid';

  }, [value, vrTest, prompt]);

  const labelColor = useMemo(() => {
    if (!vrTest || (!value)) return 'black';
    if (dPrompt) return 'status-error';
    return 'status-ok';
  }, [value, dPrompt]);

  return (
      <Box flex={false} direction={fieldOrientation} gap={gap} fill="horizontal" justify="stretch">
        <Box width={labelSize} pad={{left: 'small', right: 'small', top: 'small'}} flex={false}>
          <Text color={labelColor} weight="bold">{ucFirst(name)}</Text>
        </Box>
        <Box width={inputSize} flex={size !== 'small'} pad="xsmall">{input}</Box>
        {name ? <Box width={notesSize} pad="small" fill="vertical">
          <Text size="small" color="grey">{dPrompt || notes}</Text>
        </Box> : ''}
      </Box>
  );
}

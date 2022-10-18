import FormRow from "../../../lib/FormRow";
import { Box, Button, Text } from "grommet";
import { isEmail, isMobilePhone } from 'validator';

export function ApplicationForm({ leaf, business, name, email, phone, notes, submitStatus }) {
  return (
    <>
      <FormRow name="name" value={name} validator={[8, 40]} leaf={leaf}
               notes="your human name"/>
      <FormRow name="business" value={business} validator={[4, 40]} leaf={leaf}
               notes="the business name associated with the tokens"/>
      <FormRow name="phone" value={phone} leaf={leaf} validator={isMobilePhone}
               prompt="must be a valid phone number"/>
      <FormRow name="email" value={email} leaf={leaf} validator={isEmail}
               prompt="must be a valid email"
               notes="this e-mail address owner will have the ability to administer your account and create other users (cashiers etc.)"
      />
      <FormRow name="notes" value={notes} leaf={leaf}
               type="textarea"
               notes="some detail as to the intended use of tokens, what you plan to offer, etc."/>

      <Box margin="medium" align="center">
        <Button disabled={!!submitStatus} primary plain={false} onClick={leaf.do.submit}>
          <Text margin={{ left: 'large', right: 'large' }}>{submitStatus || 'Apply for a Producer Card'}</Text>
        </Button>
      </Box>
    </>
  )
}

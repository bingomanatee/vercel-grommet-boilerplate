import {
  Button,
  Text,
  Heading,
  Page,
  PageContent,
  Paragraph,
  Box,
  Spinner,
  Table,
  TableHeader,
  TableRow, TableCell, TableBody, TextInput
} from "grommet";
import { useContext } from "react";
import { GlobalProvider } from "../../../lib/globalState";
import Link from "next/link";
import WithLocalState from "../../../lib/WithLocalState";

const BRACKETS = [
  { upTo: 50, charge: 0 },
  { upTo: 100, charge: 1 },
  { upTo: 1000, charge: 0.5 },
  { upTo: 100000, charge: 0.25 }
]

function nextInc(index: number) {
  const { upTo } = BRACKETS[index - 1];
  return upTo + 1;
}

function dollars(amount: number) {
  try {
    return new Intl.NumberFormat('en-US',
      { style: 'currency', currency: 'USD' }
    ).format(amount);
  } catch (err) {
    return `$${amount}`
  }
}

const BracketRow = ({ upTo, charge, index }: { upTo: number; charge: number; index: number }) => {
  return (
    <TableRow key={upTo}>
      <TableCell>
        {index === 0 ? `first ${upTo} tokens redeemed` : `${nextInc(index)}...${upTo} tokens`}
      </TableCell>
      <TableCell>
        {charge <= 0 ? 'free' : `${charge} cents (${charge / 100} USD) per stamp`}

      </TableCell>
    </TableRow>
  )
}

const Join = ({ leaf, testCount, $testCharge }) => {
  const { globalLeaf, globalValue } = useContext(GlobalProvider);
  const { $loggedIn } = globalValue;
  return (
    <Page>
      <PageContent>
        {!$loggedIn ? <Spinner/> : (
          <>
            <Heading>Become a Provider</Heading>
            <Paragraph size="large">
              If you want to <b>Issue</b> tokens and <b>Redeem</b> rewards, please apply to our program
              and we will update your account.
            </Paragraph>
            <Heading level={2}>Token Charges</Heading>
            <Paragraph>
              The only charges we issue for your first Provider card are incurred when stamps are validated; you (or an
              employee)
              is required to use our service to issue stamps to your clients. The charge is on a sliding scale
              metered on a daily basis from midnight to midnight GMT.
            </Paragraph>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Maximum stamps per day</TableCell>
                  <TableCell>Charge per stamp</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BRACKETS.map((params, index) => (
                  <BracketRow key={params.upTo} index={index}  {...params} />
                ))}
                <TableRow>
                  <TableCell>
                    All subsequent stamps per day
                  </TableCell>
                  <TableCell>
                    Free
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Test Count: <TextInput type="number" value={testCount}
                                           onChange={(e) => leaf.do.setTestCount(e.target.value)}/>
                  </TableCell>

                  <TableCell>
                    {dollars($testCharge)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Heading level={2}>
              Extra Card Charges
            </Heading>
            <Paragraph>
              The above rates are for providers who have a single card; multi-card accounts
              const an <b>extra $20 / month per card</b>.
              While you <i>can</i> simply create multiple accounts
              and create a free card on each one, you lose the ability to:
            </Paragraph>
            <ul>
              <li>view the progress of your cards on our dashboard side by side</li>
              <li>allow your cashiers to validate multiple cards with the same login</li>
              <li>create cross-incentives/rewards that cash out for combinations of different cards</li>
            </ul>
            <Paragraph>
              If neither of these concerns bother you,
              feel free to create as many one-card accounts as you want.
            </Paragraph>
          </>
        )}
      </PageContent>
    </Page>
  )
}

export default WithLocalState((_, Leaf) => {
  return new Leaf({
    testCount: 1
  }, {
    selectors: {
      testCharge({ testCount }) {
        return BRACKETS.reduce((memo, bracket) => {
            let count = Math.max(0, Math.min(bracket.upTo, memo.remaining));
            if (count > 0) {
              return {
                charge: memo.charge + count * bracket.charge,
                remaining: memo.remaining - count
              }
            }
            return memo;
          },
          { remaining: testCount, charge: 0 }
        ).charge / 100
      }
    }
  })
}, Join);

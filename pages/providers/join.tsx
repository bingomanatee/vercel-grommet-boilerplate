import { Heading, Page, PageContent, Paragraph, Spinner, } from "grommet";
import { useContext, useEffect } from "react";
import { GlobalProvider } from "../../lib/globalState";
import Link from "next/link";
import WithLocalState from "../../lib/WithLocalState";
import { isEmail, isMobilePhone } from 'validator';
import { API_ROOT } from "./../../lib/constants";
import axios from "axios";
import { ApplicationForm } from "./join/ApplicationForm";

const Join = ({ leaf, business, email, phone, name, notes, $submitStatus, formState, link, formError }) => {
  const { globalLeaf, globalValue } = useContext(GlobalProvider);
  const { id, token, cookieChecked, authorized } = globalValue;
  console.log('gv.globalValue:', globalValue);
  useEffect(() => {
    if (!authorized && !cookieChecked) {
      console.log('checking cookie');
      globalLeaf.do.initCookie();
    }
  }, [cookieChecked, authorized]);

  return (
    <Page>
      <PageContent>
        {!authorized ? <Spinner/> : (
          <>
            <Heading>Become a Provider</Heading>
            <Paragraph size="large">
              If you want to <b>Issue</b> tokens and <b>Redeem</b> rewards, please apply to our program
              and we will update your account.
            </Paragraph>
            <Paragraph>
              You will be charged a <Link href="/providers/join/charges">reasonable fee</Link>
              for varying levels of traffic and a flat fee for creating multiple cards; but the TLDR is,
              you will only be charged once your program achieves a healthy velocity.
            </Paragraph>
            <Heading level={2}>Application Form</Heading>
            {formState === 'entering' ? (
              <ApplicationForm name={name} notes={notes} leaf={leaf} submitStatus={$submitStatus} business={business}
                               email={email} phone={phone} link={link}
              />) : ''}
            {formState === 'sending' ? (<>
              <Heading level={3}>Submitting your information -- please wait</Heading>
              <Spinner size="large"/>
            </>) : ''}
            {formState === 'done' ? (
              <>
                <Heading level={3}>Your request has been recorded</Heading>
                <Paragraph>
                  Please watch your inbox (<code>{email}</code>) for further information
                </Paragraph>
              </>
            ) : ''}
          </>
        )}

      </PageContent>
    </Page>
  )
}

function s(str, minSize: number, maxSize: null | number = null) {
  if (typeof str !== 'string') {
    return false;
  }
  if (minSize && (str.length < minSize)) {
    return false;
  }
  if (maxSize && (str.length > maxSize)) {
    return false;
  }
  return true;
}

const VALID_FIELDS = 4;

export default WithLocalState((_, Leaf) => {
  return new Leaf({
    email: '',
    name: '',
    phone: '',
    business: '',
    notes: '',
    link: '',
    formState: 'entering',
    formError: null
  }, {
    actions: {
      submit(leaf, auth, token) {
        leaf.do.setFormState('sending');
        console.log('---- sending leaf data:', leaf.value);
        // return;
        axios.post(API_ROOT + 'connect/join', leaf.value, {
          headers: {auth, token}
        })
          .then(({ data }) => {
            leaf.do.setFormState('done');
          })
          .catch(err => {
            leaf.do.setFormError(err);
            leaf.do.setFormState('error');
          });
      }
    },
    selectors: {
      submitStatus({ name, email, phone, business }) {
        let validFields = 0;

        if (s(name, 8, 40)) {
          validFields += 1;
        }

        if (s(business, 4, 40)) {
          validFields += 1;
        }

        if (isEmail(email)) {
          validFields += 1;
        }

        if (isMobilePhone(phone)) {
          validFields += 1;
        }

        if (validFields === 0) {
          return 'Please fill out form';
        }
        if (validFields < VALID_FIELDS) {
          return `${validFields} of ${VALID_FIELDS} fields complete`
        }
        return false;
      }
    }
  })
}, Join);

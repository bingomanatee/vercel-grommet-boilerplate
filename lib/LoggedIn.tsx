import { useContext } from "react";
import { GlobalProvider } from "./globalState";
import { Box, Paragraph } from "grommet";

 const LoggedIn = () => {
  const gv = useContext(GlobalProvider);
  console.log('gv:', gv);
  const { id, token } = gv.globalValue;
  return (
    <Box>
      <Paragraph>
        Welcome to TurtleBook.club! <b>id:</b> {id}, <b>Token</b> {token}
      </Paragraph>
    </Box>
  )

}

export default LoggedIn;

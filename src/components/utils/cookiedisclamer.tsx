import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { isIE } from "../../utils/utils";

interface CookieDisclamerProps {}
const CookieDisclamer: React.FC<CookieDisclamerProps> = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (isIE()) onOpen();
  }, []);
  return (
    <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
        <DrawerBody>
          {isIE()
            ? "Sivustomme ei toimi oikein vanhoilla selaimilla (kuten Internet Explorer). Käytä modernia selainta"
            : null}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CookieDisclamer;

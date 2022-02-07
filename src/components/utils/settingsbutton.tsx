import { SettingsIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, IconButton, MenuList, MenuItem, Spinner } from "@chakra-ui/react";
import React from "react";
import { formatGraphQLerror } from "../../utils/utils";

type settingsbuttonProps = React.ComponentProps<typeof MenuButton> & {
  isUpdating?: boolean;
  isDeleting?: boolean;
  onModify: (() => void) | (() => Promise<void>);
  onDelete: (() => void) | (() => Promise<void>);
};
export const SettingsButton: React.FC<settingsbuttonProps> = ({
  isUpdating,
  isDeleting,
  onDelete,
  onModify,
  ...props
}) => {
  return (
    <Menu preventOverflow strategy="fixed">
      <MenuButton
        display="block"
        bg="inherit!important"
        w="100%"
        h="100%"
        transition="all 0.2s"
        _hover={{}}
        _expanded={{}}
        _focus={{}}
        as={IconButton}
        paddingInline={0}
        minW="max-content"
        overflow="hidden"
        icon={<SettingsIcon w="100%" h="100%" className="tools" maxW={5} maxH={5} color="black" />}
        {...props}
      ></MenuButton>
      <MenuList overflow="hidden">
        <MenuItem onClick={onModify}>{isUpdating ? <Spinner /> : "Muokkaa"}</MenuItem>
        <MenuItem onClick={onDelete}>{isDeleting ? <Spinner /> : "Poista"}</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default SettingsButton;

import React from "react";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";

const RichText = dynamic(() => import("../utils/richtext"), { ssr: false });
type AbittieditorProps = React.ComponentProps<typeof RichText> & {};
export const Abittieditor: React.FC<AbittieditorProps> = (props) => {
  return (
    <Box className="rich-text-wrapper">
      <RichText {...props}></RichText>
    </Box>
  );
};

export default Abittieditor;

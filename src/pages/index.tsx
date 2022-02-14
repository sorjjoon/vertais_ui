import { Box, Heading } from "@chakra-ui/layout";
import { Button, UnorderedList, Wrap, ListItem } from "@chakra-ui/react";
import React, { useState } from "react";

import { GetServerSideProps } from "next";
import { Post, readAllSlugs, readSlug } from "../utils/posts-api";
import { uniq, sortBy } from "lodash-es";
import Head from "next/head";

interface IndexProps {
  posts: Post[];
}
const Index: React.FC<IndexProps> = ({ posts }) => {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const currentPost = posts[currentPostIndex];
  const categories = uniq(posts.map((p) => p.meta.category));
  return (
    <Wrap px={4} spacing={12} justify="center" maxW="90%">
      <Head>
        <title>{currentPostIndex !== 0 ? ` ${currentPost.meta.title}` : "Vertais.fi"}</title>
      </Head>
      <Box>
        <UnorderedList listStyleType="none" ml={0}>
          {categories.map((category, i) => (
            <React.Fragment key={category}>
              <ListItem mt={i > 0 ? 3 : 0}>
                <Heading color="#414141" size="sm">
                  {category}
                </Heading>
              </ListItem>
              <ListItem>
                <UnorderedList listStyleType="none">
                  {posts.map((p, j) => {
                    if (p.meta.category !== category) {
                      return null;
                    }
                    return (
                      <ListItem key={p.slug}>
                        <Button
                          variant="link"
                          fontSize="0.9em"
                          color="blackAlpha.800"
                          onClick={() => {
                            setCurrentPostIndex(j);
                            // router.push("/", { hash: posts[j].slug }, { shallow: true });
                          }}
                          _focus={{ border: "none" }}
                          textDecor={j === currentPostIndex ? "underline" : undefined}
                        >
                          {p.meta.title}
                        </Button>
                      </ListItem>
                    );
                  })}
                </UnorderedList>
              </ListItem>
            </React.Fragment>
          ))}
        </UnorderedList>
      </Box>
      <Box className={`md-wrapper ${currentPost.slug}`} dangerouslySetInnerHTML={{ __html: currentPost.HTMLContent }} />
    </Wrap>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async (context) => {
  const allSlugs = await readAllSlugs();
  const posts = sortBy(await Promise.all(allSlugs.map(readSlug)), ["meta.categoryOrder", "meta.order"]);

  return {
    props: {
      posts,
    },
  };
};

export default Index;

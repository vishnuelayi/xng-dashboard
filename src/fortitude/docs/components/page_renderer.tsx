import { Box, Container, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { SIDEBAR_CLOSED_WIDTH } from "../constants/sidebar_closed_width";
import ShowHideBox from "../../components/show_hide_box";
import { Page404 } from "../views/404";
import React from "react";

export interface QueryableDocumentationPage<T extends string> {
  identifier: T;
  title?: string;
  component?: React.ReactNode;
  options?: { disableShareLink?: boolean };
}

export function DocumentationPageRenderer<T extends string>(props: {
  pages: QueryableDocumentationPage<T>[];
  selectedPage: string;
}) {
  function isPageIDSelected(pageID: T) {
    return pageID.toLowerCase() === props.selectedPage.toLowerCase();
  }

  const atLeastOnePageVisible = props.pages.some((page) => isPageIDSelected(page.identifier));

  return (
    <>
      {props.pages.map((page) => {
        return (
          <React.Fragment key={page.identifier}>
            {isPageIDSelected(page.identifier) && <DocumentationPage page={page} />}
          </React.Fragment>
        );
      })}
      <ShowHideBox
        if={!atLeastOnePageVisible}
        show={
          <DocumentationPage
            page={{
              identifier: "404",
              component: <Page404 />,
              title: "404",
              options: { disableShareLink: true },
            }}
          />
        }
      />
    </>
  );
}

interface DocumentationPageProps<T extends string> {
  page: QueryableDocumentationPage<T>;
}
function DocumentationPage<T extends string>(props: DocumentationPageProps<T>) {
  const { page } = props;

  return (
    <FortitudeDocumentationPageLayout>
      {page.title && (
        <Box
          sx={{
            ":hover": { "#fortitude-share-link": { opacity: 1 } },
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Typography variant="h4" sx={{ color: "#333", fontWeight: 200 }}>
            {page.title}
          </Typography>

          <ShareLink id="fortitude-share-link" {...props} />
        </Box>
      )}
      {page.component}
    </FortitudeDocumentationPageLayout>
  );
}

function FortitudeDocumentationPageLayout(props: { readonly children: React.ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: `calc(100vw - ${SIDEBAR_CLOSED_WIDTH})`,
        maxHeight: "calc(100vh - 4rem)",
        overflow: "auto",
        width: "100%",
      }}
    >
      <Container maxWidth="lg">
        <Stack py="5rem" gap="1rem">
          {props.children}
        </Stack>
      </Container>
    </Box>
  );
}

function ShareLink<T extends string>(props: DocumentationPageProps<T> & { id: string }) {
  const { page, id } = props;

  return (
    <>
      {!page.options?.disableShareLink && (
        <Tooltip title="Copy URL to clipboard" arrow placement="top">
          <IconButton
            onClick={() =>
              navigator.clipboard.writeText(
                `${origin}${"/xlogs/fortitude/"}${encodeURIComponent(
                  page.identifier,
                )}`.toLowerCase(),
              )
            }
            id={id}
            sx={{ opacity: 0, transition: "opacity .2s ease" }}
          >
            <Typography variant="h5">🔗</Typography>
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}

import type { NextPageContext } from "next";

type ErrorProps = {
  statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <div>
      <p>
        {statusCode
          ? `An error ${statusCode} occurred while trying to render this page.`
          : "An error occurred while trying to render this page."}
      </p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode;
  return { statusCode };
};

export default ErrorPage;

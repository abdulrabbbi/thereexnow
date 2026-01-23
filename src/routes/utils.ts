export const getParams = (url: string): Record<string, string> => {
  const queryString = url.split("?")[1];

  if (queryString) {
    const searchParams = new URLSearchParams(queryString);

    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }

  return {};
};

export const hasParams = (url: string): boolean => {
  const queryString = url.split("?")[1];
  return queryString
    ? new URLSearchParams(queryString).toString().length > 0
    : false;
};

export function removeLastSlash(pathname: string): string {
  /**
   * Remove last slash
   * [1]
   * @input  = '/dashboard/calendar/'
   * @output = '/dashboard/calendar'
   * [2]
   * @input  = '/dashboard/calendar'
   * @output = '/dashboard/calendar'
   */
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function removeParams(url: string): string {
  try {
    const urlObj = new URL(url, window.location.origin);

    return removeLastSlash(urlObj.pathname);
  } catch {
    return url;
  }
}

export function isExternalLink(url: string): boolean {
  return url.startsWith("http");
}

export function openWindow(link: string, isExternalLink = true) {
  try {
    let url = link;

    if (isExternalLink && !url.startsWith("http")) {
      url = "https://" + url;
    }

    window.open(url, "_blank");
  } catch (error) {
    console.log(error);
  }
}

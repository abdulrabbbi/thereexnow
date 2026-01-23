import queryString from "query-string";

export function getCompleteProfileRoute() {
  return "/complete-profile";
}

export function getSignInRoute() {
  return `/sign-in`;
}

export function getSignUpRoute() {
  return "/sign-up";
}

export function getProfileRoute() {
  return "/settings/profile";
}

export function getOrdersRoute() {
  return "/settings/orders";
}

export function getCategoriesRoute({
  keyword,
  categoryId,
  subCategoryId,
  source = "exercises",
}: {
  keyword?: string;
  categoryId?: number;
  subCategoryId?: number;
  source?: "exercises" | "favorites" | "shop";
}) {
  const queryParams = queryString.stringify(
    { keyword, categoryId, subCategoryId },
    {
      skipNull: true,
      skipEmptyString: true,
    }
  );

  return `/${source}${queryParams.length ? `?${queryParams}` : ""}`;
}

export function getExerciseRoute(id: number) {
  return `/exercises/detail?id=${id}`;
}

export function getBoardDetailsRoute() {
  return "/exercises/board";
}

export function getRoutineRoute(id: number) {
  return `/routines/detail?id=${id}`;
}

export function getProductRoute(id: number) {
  return `/shop/product?id=${id}`;
}

export function getShopRoute() {
  return "/shop";
}

export function getCheckoutRoute() {
  return "/shop/checkout";
}

export function getSharedExercisesRoute(id: number) {
  return `https://therexnow.com/html?id=${id}`;
}

export function getEmailVerifyRoute() {
  return "https://therexnow.com/email-verified";
}

export function getPublicTermsRoute() {
  return "/terms";
}

export function getPublicPrivacyRoute() {
  return "/privacy";
}

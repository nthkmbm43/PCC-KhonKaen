// These four pages report the same company events as the original corporate
// news posts. A cross-domain canonical protects the original publisher's
// search signals while the local page remains available to customers.
export const cooperativeSourceCanonicals: Readonly<Record<string, string>> = {
  "governor-kraisorn-kongchalad-visits-pcc":
    "https://pcc-posttension.com/khonkaen-governor-visit-pcc-postension/",
  "trin-siricharuwon-sense-and-love-speaker":
    "https://pcc-posttension.com/%e0%b8%84%e0%b8%b8%e0%b8%93%e0%b8%95%e0%b8%a4%e0%b8%93-%e0%b8%a8%e0%b8%b4%e0%b8%a3%e0%b8%b4%e0%b8%88%e0%b8%b2%e0%b8%a3%e0%b8%b8%e0%b8%a7%e0%b8%a3-%e0%b8%9c%e0%b8%b9%e0%b9%89%e0%b8%88%e0%b8%b1%e0%b8%94/",
  "deputy-governor-panthep-saokosol-visits-pcc":
    "https://pcc-posttension.com/%e0%b8%a3%e0%b8%ad%e0%b8%87%e0%b8%9c%e0%b8%b9%e0%b9%89%e0%b8%a7%e0%b9%88%e0%b8%b2%e0%b8%82%e0%b8%ad%e0%b8%99%e0%b9%81%e0%b8%81%e0%b9%88%e0%b8%99-%e0%b9%80%e0%b8%a2%e0%b8%b5%e0%b9%88%e0%b8%a2%e0%b8%a1/",
  "somchart-suparee-workforce-development-visit":
    "https://pcc-posttension.com/%e0%b8%aa%e0%b8%a1%e0%b8%8a%e0%b8%b2%e0%b8%95%e0%b8%b4-%e0%b8%aa%e0%b8%b8%e0%b8%a0%e0%b8%b2%e0%b8%a3%e0%b8%b5-%e0%b8%9e%e0%b8%b1%e0%b8%92%e0%b8%99%e0%b8%b2%e0%b8%9d%e0%b8%b5%e0%b8%a1%e0%b8%b7%e0%b8%ad/",
};

export function getCooperativeSourceCanonical(slug: string) {
  return cooperativeSourceCanonicals[slug];
}

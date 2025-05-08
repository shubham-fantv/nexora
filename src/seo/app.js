import {
  BreadcrumbJsonLd,
  DefaultSeo,
  SiteLinksSearchBoxJsonLd,
  SocialProfileJsonLd,
} from "next-seo";

const AppSeo = () => {
  return (
    <>
      <DefaultSeo
        title="Video Nation"
        description="Create Music songs using AI"
        additionalMetaTags={[
          {
            property: "al:android:url",
            content: "fantiger://",
          },
          {
            property: "al:android:app_name",
            content: "VideoNation",
          },
          {
            property: "al:android:package",
            content: "com.fantv",
          },
        ]}
      />
    </>
  );
};

export default AppSeo;

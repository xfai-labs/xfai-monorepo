import Link from 'next/link';
import React from 'react';
import { Layout, Button, useScreenSizeChange } from '@xfai-labs/ui-components';
import Localization from '@landing/localization';
import SectionTitle from '@landing/components/SectionTitle';
import MainConfig from '@landing/config/MainConfig';
import { ReactComponent as BuildWithXfai } from '@landing/public/documentationFeatures/build_with_xfai.svg';
import { ReactComponent as BuildWithXfaiDesktop } from '@landing/public/documentationFeatures/build_with_xfai_desktop.svg';
import { ReactComponent as FeatureRequests } from '@landing/public/documentationFeatures/feature_request.svg';
import { ReactComponent as FeatureRequestsDesktop } from '@landing/public/documentationFeatures/feature_request_desktop.svg';

export default function DocumentationFeatures() {
  const { isMobile } = useScreenSizeChange();

  return (
    <section className="bg-black-white/30 flex w-full flex-col gap-12 py-12 lg:gap-16 lg:py-16 2xl:gap-24 2xl:py-24">
      <Layout.Container className="flex flex-col items-center gap-10">
        <Layout.Row className="grid !w-11/12 grid-cols-1 sm:!w-10/12 md:!w-full md:grid-cols-2 xl:!w-11/12">
          <Layout.Column className="mb-12 gap-10 md:mb-0">
            {!isMobile ? (
              <BuildWithXfaiDesktop className="h-auto w-full" />
            ) : (
              <BuildWithXfai className="h-auto w-full" />
            )}
            <div className="flex grow flex-col items-center gap-8 lg:px-4 xl:px-6 2xl:px-8">
              <SectionTitle
                title={Localization.DOCUMENTATION_TITLE}
                description={Localization.DOCUMENTATION_DESCRIPTION}
                className="text-center"
              />
              <Button
                NavLink={Link}
                href={MainConfig.DOCUMENTATION_URL}
                disabled={!MainConfig.DOCUMENTATION_URL}
                target="_blank"
                bgColor="bg-magenta hover:bg-magenta-dark"
                // bgColor="bg-gradient-to-r from-[#DC4099] to-[#9566AA]"
                size="xl"
              >
                {Localization.DOCUMENTATION_BUTTON}
              </Button>
            </div>
          </Layout.Column>
          <Layout.Column className="gap-10">
            {!isMobile ? (
              <FeatureRequestsDesktop className="h-auto w-full" />
            ) : (
              <FeatureRequests className="h-auto w-full" />
            )}
            <div className="flex grow flex-col items-center gap-8 lg:px-4 xl:px-6 2xl:px-8">
              <SectionTitle
                title={Localization.FEATURE_REQUEST_TITLE}
                description={Localization.FEATURE_REQUEST_DESCRIPTION}
                className="text-center"
              />
              <Button
                NavLink={Link}
                href={MainConfig.FEATURE_REQUEST_URL}
                disabled={!MainConfig.FEATURE_REQUEST_URL}
                target="_blank"
                bgColor="bg-cyan hover:bg-cyan-dark"
                // bgColor="bg-gradient-to-r from-[#7A83B4] to-[#5AB9C5]"
                size="xl"
              >
                {Localization.FEATURE_REQUEST_BUTTON}
              </Button>
            </div>
          </Layout.Column>
        </Layout.Row>
      </Layout.Container>
    </section>
  );
}

import Image from 'next/image';
import React from 'react';
import { Layout } from '@xfai-labs/ui-components';
import Localization from '@landing/localization';
import Chains from '@landing/config/Chains';
import SectionTitle from '@landing/components/SectionTitle';
import cs from 'classnames';
import ChainsIllustration from '@landing/public/chains/chainsIllustration.webp';

export default function SupportedChains() {
  return (
    <Layout.Container className="flex flex-col items-center xl:py-14">
      <Layout.Row className="from-cyan to-magenta !w-11/12 flex-col items-center justify-center !gap-0 rounded-xl bg-gradient-to-b text-white md:flex-row md:bg-gradient-to-r lg:!w-full">
        <Layout.Column className="relative w-full items-center justify-center gap-8 md:w-5/12 md:gap-16 lg:w-1/2">
          <Image
            src={ChainsIllustration}
            alt="Xfai Chains Illustration"
            className="relative -top-7 block w-[110%] max-w-none md:absolute md:-left-[5%] md:-right-10 md:top-[unset] md:h-auto md:w-full md:max-w-[95%] lg:right-[unset]"
            priority
          />
        </Layout.Column>
        <Layout.Column className="xl:py-18 mg:px-10 w-full items-center justify-center gap-4 px-5 pb-10 pt-2 text-center md:w-8/12 md:items-start md:justify-center md:py-14 md:text-left lg:w-1/2 lg:gap-6 lg:px-0">
          <div className="flex items-center justify-start gap-8">
            {Chains.map((chain, id) => (
              <chain.logo key={id} className={cs('block h-8 w-auto md:h-10', chain.className)} />
            ))}
          </div>
          <SectionTitle title={Localization.CHAINS_TITLE} />
          <p className="text-sm lg:w-10/12 lg:text-base">{Localization.CHAINS_DESCRIPTION}</p>
        </Layout.Column>
      </Layout.Row>
    </Layout.Container>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Layout, VisualLink } from '@xfai-labs/ui-components';
import Localization from '@landing/localization';
import SectionTitle from '@landing/components/SectionTitle';
import FeaturesList from '@landing/config/FeaturesList';

export default function Features() {
  return (
    <Layout.Container className="flex flex-col gap-10">
      <Layout.Row className="items-center justify-center">
        <Layout.Column className="w-10/12 text-center lg:w-8/12 xl:w-6/12 2xl:w-5/12">
          <SectionTitle
            title={Localization.FEATURES_TITLE}
            description={Localization.FEATURES_DESCRIPTION}
            className="text-center"
          />
        </Layout.Column>
      </Layout.Row>
      <Layout.Row className="items-center justify-center">
        <Layout.Column className="grid w-11/12 grid-cols-1 gap-5 text-center sm:w-11/12 sm:grid-cols-2 md:w-11/12 lg:w-full lg:gap-7 2xl:gap-8">
          {FeaturesList.map((feature, id) => (
            <Link
              href={feature.link ?? '#'}
              target="_blank"
              className={!feature.link && 'pointer-events-none'}
              key={id}
            >
              <article className="bg-white-black/5 hover:bg-white-black/[0.08] flex h-full w-full flex-col items-center gap-7 rounded-2xl p-7 transition duration-150 hover:scale-105 lg:gap-8 lg:p-8 xl:flex-row xl:justify-center">
                <figure className="relative aspect-square w-6/12 shrink-0 lg:p-2 xl:w-5/12">
                  <Image src={feature.image} alt={feature.name} />
                </figure>
                <figcaption className="flex flex-col items-center gap-2.5 text-center xl:items-start xl:text-left">
                  <h3 className="text-xl lg:text-2xl">{feature.name}</h3>
                  <p className="text-5 text-sm 2xl:text-base 2xl:font-light">
                    {feature.description}
                  </p>
                  <VisualLink className={!feature.link && 'grayscale'}>
                    {Localization.LEARN_MORE_BUTTON}
                  </VisualLink>
                </figcaption>
              </article>
            </Link>
          ))}
        </Layout.Column>
      </Layout.Row>
    </Layout.Container>
  );
}

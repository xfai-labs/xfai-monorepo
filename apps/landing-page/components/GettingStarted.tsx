import Link from 'next/link';
import React from 'react';
import { Layout, VisualLink } from '@xfai-labs/ui-components';
import Localization from '@landing/localization';
import SectionTitle from '@landing/components/SectionTitle';
import GettingStartedArticles from '@landing/config/GettingStartedArticles';
import cs from 'classnames';

export default function GettingStarted() {
  return (
    <Layout.Container className="flex flex-col gap-10">
      <Layout.Row className="items-center justify-center">
        <Layout.Column className="w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-5/12">
          <SectionTitle title={Localization.GETTING_STARTED_TITLE} className="text-center" />
        </Layout.Column>
      </Layout.Row>
      <Layout.Row className="items-center justify-center">
        <Layout.Column className="grid w-11/12 grid-cols-1 items-center gap-5 sm:w-11/12 sm:grid-cols-2 md:w-11/12 lg:w-full lg:grid-cols-3 lg:gap-7 2xl:gap-8">
          {GettingStartedArticles.map((article, id) => (
            <Link
              href={article.link ?? '#'}
              key={id}
              className={cs(
                'h-full w-full sm:max-lg:last-of-type:col-span-full',
                !article.link && 'pointer-events-none',
              )}
              target="_blank"
            >
              <article className="bg-white-black/5 hover:bg-white-black/[0.08] border-70 flex h-full flex-col items-center gap-2 rounded-xl border p-5 text-center transition duration-150 hover:scale-105 sm:items-start sm:text-left lg:gap-3 lg:rounded-2xl lg:p-8">
                <h3 className="text-xl xl:text-[1.35rem]">{article.title}</h3>
                <p className="grow text-base font-light">{article.description}</p>
                <VisualLink className={!article.link && 'grayscale'}>
                  {Localization.LEARN_MORE_BUTTON}
                </VisualLink>
              </article>
            </Link>
          ))}
        </Layout.Column>
      </Layout.Row>
    </Layout.Container>
  );
}

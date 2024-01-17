import React from 'react';
import { Layout } from '@xfai-labs/ui-components';
import BackedByLogos from '@landing/config/BackedByLogos';

export default function Features() {
  return (
    <Layout.Container className="lg:-mt-16">
      <Layout.Row className="lg:bg-white-black/5 items-center justify-center !gap-3 lg:!gap-0 lg:rounded-xl lg:backdrop-blur-md">
        <Layout.Column className="shrink-0 items-center text-center lg:p-5 2xl:p-6">
          <h2 className="text-lg uppercase 2xl:text-xl">Backed By</h2>
        </Layout.Column>
        <Layout.Column className="group/track bg-white-black/5 w-full grow overflow-hidden rounded-lg backdrop-blur-md lg:rounded-none lg:bg-transparent lg:backdrop-filter-none">
          <div className="maskx-5 flex overflow-hidden p-4 lg:p-5 2xl:p-6">
            <div className="animate-ticker lg:group-hover/track:animation-paused flex items-center">
              {BackedByLogos.map((Logo, id) => (
                <Logo
                  className="fill-10 hover:fill-white-blue mr-8 h-8 w-auto shrink-0 transition-colors duration-150 lg:h-10 2xl:h-12"
                  key={id}
                />
              ))}
            </div>
            <div className="animate-ticker lg:group-hover/track:animation-paused flex items-center">
              {BackedByLogos.map((Logo, id) => (
                <Logo
                  className="fill-10 hover:fill-white-blue mr-8 h-8 w-auto shrink-0 transition-colors duration-150 lg:h-10 2xl:h-12"
                  key={id}
                />
              ))}
            </div>
          </div>
        </Layout.Column>
      </Layout.Row>
    </Layout.Container>
  );
}

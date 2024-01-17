import Link from 'next/link';
import { motion } from 'framer-motion';
import { Layout, Button } from '@xfai-labs/ui-components';
import Localization from '@landing/localization';
import FrequentlyAskedQuestions from '@landing/config/FrequentlyAskedQuestions';
import PageTitle from '@landing/components/PageTitle';
import PageMetaTags from '@landing/components/Head/PageTags';
import MainConfig from '@landing/config/MainConfig';

export default function FAQ() {
  return (
    <>
      <PageMetaTags title={Localization.FAQ_TITLE} description={Localization.FAQ_SUBTITLE} />
      <motion.div
        key="homepage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
        className="flex w-full grow flex-col items-center gap-24 self-stretch pb-16 lg:pt-16"
      >
        <Layout.Container>
          <Layout.Row className="!gap-16">
            <Layout.Column className="gap-8 text-center lg:w-1/2 lg:gap-8 lg:text-left 2xl:w-5/12 2xl:gap-8">
              <PageTitle title={Localization.FAQ_TITLE} description={Localization.FAQ_SUBTITLE} />
              {FrequentlyAskedQuestions.map((faq, id) => (
                <article className="flex flex-col gap-4 lg:gap-6" key={id}>
                  <h2 className="text-xl 2xl:text-2xl">{faq.question}</h2>
                  <p className="text-base xl:text-lg">{faq.answer}</p>
                </article>
              ))}
              <div className="flex flex-col items-center gap-4 lg:items-start lg:gap-6">
                <h3 className="text-xl 2xl:text-2xl">
                  {Localization.WANT_TO_KNOW_MORE_ABOUT_XFAI_Q}
                </h3>
                <Button
                  NavLink={Link}
                  href={MainConfig.DOCUMENTATION_URL}
                  disabled={!MainConfig.DOCUMENTATION_URL}
                  target="_blank"
                  bgColor="bg-magenta hover:bg-magenta-dark"
                  // bgColor="bg-gradient-to-r from-[#DC4099] to-[#9566AA]"
                  size="xl"
                >
                  {Localization.LEARN_MORE_BUTTON}
                </Button>
              </div>
            </Layout.Column>
            <Layout.Column className="z-[0] order-first lg:order-last">
              <div className="bg-faq-light dark:bg-faq-dark aspect-[2/1] bg-cover bg-center lg:fixed lg:inset-y-0 lg:left-[55%] lg:right-0 lg:aspect-auto 2xl:left-1/2" />
            </Layout.Column>
          </Layout.Row>
        </Layout.Container>
      </motion.div>
    </>
  );
}

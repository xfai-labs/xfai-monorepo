import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import {
  Layout,
  Button,
  ButtonIcon,
  IconExit,
  Spinner,
  useThemeContext,
} from '@xfai-labs/ui-components';
import MainConfig from '@landing/config/MainConfig';
import Localization from '@landing/localization';
import PageTitle from '@landing/components/PageTitle';
import HeroAnimation from '@landing/public/hero/hero_animation.json';
import HeroDarkImage from '@landing/public/hero/hero_logo_dark.webp';
import HeroLightImage from '@landing/public/hero/hero_logo_light.webp';
import cs from 'classnames';
import useDappLocation from '@landing/utils/dappLocation';

export default function Hero() {
  const [videoOpen, setVideoOpen] = React.useState(false);
  const [videoReady, setVideoReady] = React.useState(false);
  const ref = useRef();
  const { isDarkMode } = useThemeContext();
  const dappLocation = useDappLocation();

  const [heroImage, setHeroImage] = React.useState(undefined);

  useEffect(() => {
    if (isDarkMode) {
      setHeroImage(HeroDarkImage);
    } else {
      setHeroImage(HeroLightImage);
    }
  }, [isDarkMode]);

  return (
    <>
      <Layout.Container className="flex items-center justify-center lg:justify-start" id="hero">
        <Layout.Row className="relative items-center !gap-5">
          <Layout.Column className="z-10 order-last w-full items-center gap-5 sm:w-8/12 md:w-6/12 lg:order-first lg:w-5/12 lg:items-start xl:w-4/12">
            <PageTitle
              title={Localization.HERO_TITLE}
              description={Localization.HERO_SUBTITLE}
              className="text-center lg:text-left"
            />
            <div className="flex gap-4">
              <Button
                size="xl"
                NavLink={Link}
                target="_blank"
                href={dappLocation(MainConfig.APP_URL)}
                className="uppercase"
              >
                {Localization.OPEN_APP_BUTTON}
              </Button>
              <Button
                color="text-10 hover:text-5"
                bgColor="bg-60 hover:bg-50"
                size="xxl"
                onClick={() => setVideoOpen(true)}
              >
                {Localization.HERO_VIDEO_BUTTON}
              </Button>
            </div>
          </Layout.Column>
          <Layout.Column className="h-[18rem] w-full items-center justify-center gap-5 sm:h-[22rem] md:h-[25rem] lg:h-[34rem] lg:w-7/12 xl:h-[40rem] xl:w-8/12">
            <div className="absolute aspect-[6/4] w-[170%] sm:w-[150%] md:w-[120%] lg:-right-[15%] lg:w-full">
              <Lottie
                animationData={HeroAnimation}
                autoPlay={true}
                loop={true}
                className="hero-animation absolute inset-0 z-0 aspect-[6/4] object-contain"
              />
              {heroImage && (
                <Image
                  src={heroImage}
                  alt="Xfai 3D Banner Logo"
                  className="relative block aspect-[6/4] w-full object-contain"
                  priority
                />
              )}
            </div>
          </Layout.Column>
        </Layout.Row>
      </Layout.Container>
      <AnimatePresence mode="popLayout">
        {videoOpen && (
          <Dialog
            key="video-dialog"
            initialFocus={ref}
            as={motion.div}
            open={videoOpen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden p-4 md:p-7 lg:p-10"
            onClose={() => setVideoOpen(false)}
          >
            <div className="fixed inset-0 bg-black opacity-80" />
            <Dialog.Panel
              as={motion.div}
              key="video-panel"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: 'linear', duration: 0.2 }}
              className="flex h-full w-full items-center justify-center"
            >
              <div className="relative z-50 aspect-video w-full max-w-6xl">
                <ButtonIcon
                  size="xx-small"
                  color="fill-white"
                  bgColor="bg-magenta hover:bg-magenta-dark"
                  icon={IconExit}
                  onClick={() => {
                    setVideoReady(false);
                    setVideoOpen(false);
                  }}
                  className="absolute right-0 top-0 z-30 -translate-y-1/2 translate-x-1/2"
                />
                <div className="bg-bg relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl p-px xl:rounded-2xl">
                  <Spinner round className="" />
                  <YouTube
                    videoId={MainConfig.HERO_VIDEO_ID}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        modestbranding: 0,
                        showinfo: 1,
                        rel: 0,
                        fs: 0,
                        cc_load_policy: 0,
                        iv_load_policy: 3,
                      },
                    }}
                    className={cs(
                      'absolute inset-0 transition-opacity duration-300',
                      videoReady ? 'opacity-100' : 'opacity-0',
                    )}
                    onReady={() => setVideoReady(true)}
                  />
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}

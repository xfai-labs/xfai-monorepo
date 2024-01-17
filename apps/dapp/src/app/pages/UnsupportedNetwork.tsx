import {
  Button,
  ButtonIcon,
  FormTitle,
  DivideContainer,
  IconSwapArrows,
  IconSliders,
  InlineLink,
} from '@xfai-labs/ui-components';
import AmountBox from '@dapp/components/Shared/AmountBox';
import Localization from '@dapp/localization';
import PageLayout from '@dapp/components/Shared/PageLayout';
import PageMetaTags from '@dapp/components/Shared/PageTags';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import { useAppContext } from '@dapp/context/AppContext';

const UnsupportedNetwork = () => {
  const { showModal } = useGlobalModalContext();
  const { switchingChain } = useAppContext();
  return (
    <>
      <PageLayout.Page pageKey="unsupportedChain">
        <PageMetaTags title={Localization.Swap.PageInfo.TITLE} />
        <PageLayout.Title
          title={Localization.Swap.PageInfo.TITLE}
          highlightedWords={[Localization.Swap.PageInfo.HIGHLIGHT_TITLE]}
          description={Localization.Swap.PageInfo.DESCRIPTION}
        >
          <InlineLink target="_blank">{Localization.Swap.PageInfo.DOCUMENTATION_BUTTON}</InlineLink>
        </PageLayout.Title>

        <PageLayout.Group>
          <PageLayout.Card>
            <PageLayout.CardGroup>
              <FormTitle
                size="large"
                title={Localization.Swap.Label.SWAP}
                titleTooltip={Localization.Swap.Tooltip.TOOLTIP}
                buttonIcon={IconSliders}
                buttonOnClick={() => ({})}
              />
              <AmountBox />

              <DivideContainer>
                <ButtonIcon
                  size="large"
                  icon={IconSwapArrows}
                  bgColor="bg-60 hover:bg-cyan"
                  color="fill-cyan hover:fill-white"
                  hoverEffect="scaleUp"
                />
              </DivideContainer>

              <AmountBox />
            </PageLayout.CardGroup>

            <Button type="submit" size="xl">
              {Localization.Swap.Button.SWAP}
            </Button>
          </PageLayout.Card>
        </PageLayout.Group>
      </PageLayout.Page>
      <div className="bg-bg/90 absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-center backdrop-blur-sm">
        <h1 className="text-white-blue text-2xl uppercase leading-none xl:text-3xl">
          {Localization.Label.UNSUPPORTED_NETWORK}
        </h1>
        <h3 className="text-magenta mb-4 text-xl font-light uppercase leading-none">
          {Localization.Label.SWITCH_TO_A_SUPPORTED_NETWORK}
        </h3>
        <Button
          size="large"
          disabled={switchingChain}
          onClick={() => {
            showModal('SelectNetworkModal');
          }}
        >
          {!switchingChain
            ? Localization.Label.SWITCH_NETWORK
            : Localization.Label.CONFIRM_NETWORK_SWITCH}
        </Button>
      </div>
    </>
  );
};

export default UnsupportedNetwork;

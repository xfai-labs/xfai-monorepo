import Input, { InputProps } from 'rc-input';
import ButtonIcon from './ButtonIcon';
import { IconExit, IconSearch } from './assets/icons';
import cs from 'classnames';

type Props = {
  size?: 'small' | 'medium';
} & InputProps;

const SearchBar = ({
  onChange,
  disabled,
  defaultValue,
  autoFocus,
  size = 'medium',
  ...props
}: Props) => {
  return (
    <Input
      disabled={disabled}
      autoFocus={autoFocus}
      className={cs({ 'search-bar-small': size === 'small' })}
      prefixCls="search-bar"
      prefix={<IconSearch className="search-bar-icon fill-10" />}
      placeholder="Search"
      allowClear={{
        clearIcon: (
          <ButtonIcon
            size="xx-small"
            bgColor="bg-50 hover:bg-30"
            color="fill-10 hover:fill-white-blue"
            icon={IconExit}
            disabled={disabled}
          />
        ),
      }}
      onChange={onChange}
      defaultValue={defaultValue}
      {...props}
    />
  );
};

export default SearchBar;

create function calculate_adjusted_price(token_id bigint, decimals integer, usd_price numeric, eth_balance numeric, token_balance numeric, token_in numeric) returns numeric
    immutable
    leakproof
    parallel safe
    language plpgsql
as
$$
DECLARE
    adjusted_price numeric;
    eth_unit constant numeric := POWER(10::numeric,18::numeric);
    token_amount int := 2;
    ETH_TOKEN_ID constant bigint := 40000;
BEGIN

    if eth_balance < (eth_unit / 2) then
        token_amount = 0;
    end if;

    if token_id = ETH_TOKEN_ID THEN
        adjusted_price := usd_price;
    else
        adjusted_price :=
            ((POWER(10::numeric, decimals - token_amount) *
            eth_balance * usd_price /
            (token_balance + POWER(10, decimals - token_amount))::numeric) / eth_unit )  * POW(10,token_amount);
    end if;

    RETURN Round(token_in * adjusted_price  / power(10,decimals + 6)::numeric,8) ;
END;
$$;
create function calculate_adjusted_price(token_id bigint, decimals integer, usd_price numeric, eth_balance numeric, token_balance numeric) returns numeric
    immutable
    leakproof
    parallel safe
    language plpgsql
as
$$
BEGIN
   return calculate_adjusted_price(token_id,decimals,usd_price,eth_balance,token_balance,POWER(10::numeric,decimals::numeric));
END;
$$;

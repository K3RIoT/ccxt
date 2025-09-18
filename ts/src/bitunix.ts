
// ---------------------------------------------------------------------------

import Exchange from './abstract/bitunix.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import { BadRequest, ExchangeError, AuthenticationError, PermissionDenied, ArgumentsRequired, RequestTimeout, InvalidOrder, ExchangeNotAvailable, InsufficientFunds } from './base/errors.js';
// ---------------------------------------------------------------------------

/**
 * @class bitunix
 * @augments Exchange
 */

export default class bitunix extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'bitunix',
            'name': 'Bitunix',
            'countries': [ 'VC' ], // Saint Vincent & the Grenadines, source: https://www.coingecko.com/en/exchanges/bitunix
            'rateLimit': 100,
            'version': 'v1',
            'certified': false,
            'pro': false,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'addMargin': false,
                'cancelAllOrders': false,
                'cancelAllOrdersAfter': false,
                'cancelOrder': false,
                'cancelOrders': false,
                'cancelWithdraw': false,
                'closePosition': false,
                'createConvertTrade': false,
                'createDepositAddress': false,
                'createLimitBuyOrder': false,
                'createLimitSellOrder': false,
                'createMarketBuyOrder': false,
                'createMarketBuyOrderWithCost': false,
                'createMarketOrder': false,
                'createMarketOrderWithCost': false,
                'createMarketSellOrder': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': false,
                'createOrders': false,
                'createOrderWithTakeProfitAndStopLoss': false,
                'createPostOnlyOrder': false,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': false,
                'createStopLossOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'createTakeProfitOrder': false,
                'createTrailingAmountOrder': false,
                'createTrailingPercentOrder': false,
                'createTriggerOrder': false,
                'fetchAccounts': false,
                'fetchBalance': false,
                'fetchCanceledAndClosedOrders': false,
                'fetchCanceledOrders': false,
                'fetchClosedOrder': false,
                'fetchClosedOrders': false,
                'fetchConvertCurrencies': false,
                'fetchConvertQuote': false,
                'fetchConvertTrade': false,
                'fetchConvertTradeHistory': false,
                'fetchCurrencies': false,
                'fetchDepositAddress': false,
                'fetchDeposits': false,
                'fetchDepositsWithdrawals': false,
                'fetchDepositWithdrawFees': false,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchLedger': false,
                'fetchLeverage': false,
                'fetchLeverageTiers': false,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarginMode': false,
                'fetchMarkets': false,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': false,
                'fetchOHLCV': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrder': false,
                'fetchOpenOrders': false,
                'fetchOrder': false,
                'fetchOrderBook': false,
                'fetchOrders': false,
                'fetchOrderTrades': false,
                'fetchPosition': false,
                'fetchPositionHistory': false,
                'fetchPositionMode': false,
                'fetchPositions': false,
                'fetchPositionsForSymbol': false,
                'fetchPositionsHistory': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchStatus': false,
                'fetchTicker': false,
                'fetchTickers': false,
                'fetchTime': false,
                'fetchTrades': false,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTransactions': false,
                'fetchTransfers': false,
                'fetchWithdrawals': false,
                'reduceMargin': false,
                'sandbox': false,
                'setLeverage': false,
                'setMargin': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'transfer': false,
                'withdraw': false,
            },
            'timeframes': {
                '1m': '1',
                '3m': '3',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '2h': '120',
                '4h': '240',
                '6h': '360',
                '12h': '720',
                '1d': 'D',
                '1w': 'W',
                '1M': 'M',
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'maker': this.parseNumber ('0.0008'), // VIP 0 default: 0.0800%
                    'taker': this.parseNumber ('0.0010'), // VIP 0 default: 0.1000%
                    'tiers': {
                        'maker': [
                            this.parseNumber ('0.0008'),   // VIP 0 → 0.0800%
                            this.parseNumber ('0.0007'),   // VIP 1 → 0.0700%
                            this.parseNumber ('0.0006'),   // VIP 2 → 0.0600%
                            this.parseNumber ('0.00035'),  // VIP 3 → 0.0350%
                            this.parseNumber ('0.0002'),   // VIP 4 → 0.0200%
                            this.parseNumber ('0.00015'),  // VIP 5 → 0.0150%
                            this.parseNumber ('0.000125'), // VIP 6 → 0.0125%
                            this.parseNumber ('0.0001'),   // VIP 7 → 0.0100%
                        ],
                        'taker': [
                            this.parseNumber ('0.0010'),   // VIP 0 → 0.1000%
                            this.parseNumber ('0.0009'),   // VIP 1 → 0.0900%
                            this.parseNumber ('0.0008'),   // VIP 2 → 0.0800%
                            this.parseNumber ('0.0006'),   // VIP 3 → 0.0600%
                            this.parseNumber ('0.0005'),   // VIP 4 → 0.0500%
                            this.parseNumber ('0.00045'),  // VIP 5 → 0.0450%
                            this.parseNumber ('0.000375'), // VIP 6 → 0.0375%
                            this.parseNumber ('0.000325'), // VIP 7 → 0.0325%
                        ],
                    },
                },
            },
            'hostname': 'bitunix.com',
            'urls': {
                'logo': '',
                'api': {
                    'public': 'https://openapi.bitunix.com/',
                    'private': 'https://openapi.bitunix.com/',
                },
                'www': 'https://www.bitunix.com/',
                'doc': 'https://api-doc.bitunix.com/en_us/',
                'fees': 'https://support.bitunix.com/hc/en-us/articles/14042741811865-Bitunix-Trading-Fees-and-VIP-System',
                'referral': {
                    'url': 'https://www.bitunix.com/register?inviteCode=2a9t1r',
                    'discount': 0.1,
                },
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
            },
            'api': {
                'public': {
                    'get': {
                        'api/spot/v1/market/last_price': 1,
                        'api/spot/v1/market/depth': 1,
                        'api/spot/v1/market/klines': 1,
                        'api/spot/v1/market/kline/history': 1,
                        'api/spot/v1/common/coin_pair/list': 1,
                        'api/spot/v1/common/rate/list': 1,
                        'api/spot/v1/common/coin/coin_network/list': 1,
                    },
                },
                'private': {
                    'get': {
                        'api/spot/v1/user/account': 1,
                        'api/spot/v1/order/detail': 1,
                    },
                    'post': {
                        'api/spot/v1/withdraw': 1,
                        'api/spot/v1/withdraw/cancel': 1,
                        'api/spot/v1/inside_transfer': 1,
                        'api/spot/v1/inside_transfer/cancel': 1,
                        'api/spot/v1/withdraw_transfer/page': 1,
                        'api/spot/v1/funds_transfer': 1,
                        'api/spot/v1/order/place_order': 1,
                        'api/spot/v1/order/place_order/batch': 1,
                        'api/spot/v1/order/cancel': 1,
                        'api/spot/v1/order/deal/list': 1,
                        'api/spot/v1/order/history/page': 1,
                        'api/spot/v1/order/pending/list': 1,
                    },
                },
            },
            'exceptions': {
                'exact': {
                    '0': undefined, // Success, no exception
                    '2': BadRequest, // Parameter error
                    '500': ExchangeError, // System error
                    '100004': AuthenticationError, // app-key not found
                    '10016': PermissionDenied, // User does not exist
                    '70003': ArgumentsRequired, // Missing Parameters
                    '100008': RequestTimeout, // Request expired
                    '100005': AuthenticationError, // Parameter signature error
                    '10058': InvalidOrder, // volume precision error
                    '110041': ExchangeNotAvailable, // Interface access times are too fast
                    '110007': InsufficientFunds, // Withdrawal amount cannot be less than the current fee
                    '110008': PermissionDenied, // Only withdrawals to whitelisted addresses are allowed
                },
            },
        });
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const base = this.urls['api'][api];
        let url = base + '/' + path;
        const query = this.omit (params, []);
        if (api === 'public') {
            if (Object.keys (query).length) {
                url += '?' + this.urlencode (query);
            }
            return { url, method, body, headers };
        }
        this.checkRequiredCredentials ();
        const timestamp = this.milliseconds ().toString ();
        const nonce = this.uuid ().replace (/-/g, '').slice (0, 32);
        const sorted = this.keysort (query);
        const queryParamsForSign = Object.keys (sorted).map ((k) => k + '=' + String (sorted[k])).join ('');
        if (method !== 'GET' && Object.keys (query).length) {
            body = this.json (query);
        } else {
            body = (body === undefined || body === null) ? '' : body;
        }
        const apiKey = this.apiKey;
        const digest = this.hash (nonce + timestamp + apiKey + queryParamsForSign + (body || ''), sha256);
        const sign = this.hash (digest + this.secret, sha256);
        if (method === 'GET' && Object.keys (query).length) {
            url += '?' + this.urlencode (query);
        }
        headers = {
            'api-key': apiKey,
            'nonce': nonce,
            'timestamp': timestamp,
            'sign': sign,
            'Content-Type': 'application/json',
        };
        return { url, method, body, headers };
    }
}

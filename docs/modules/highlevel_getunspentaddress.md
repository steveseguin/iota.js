[@iota/iota.js](../README.md) / highLevel/getUnspentAddress

# Module: highLevel/getUnspentAddress

## Table of contents

### Functions

- [getUnspentAddress](highlevel_getunspentaddress.md#getunspentaddress)

## Functions

### getUnspentAddress

▸ **getUnspentAddress**(`client`: [*IClient*](../interfaces/models/iclient.iclient.md), `seed`: [*ISeed*](../interfaces/models/iseed.iseed.md), `accountIndex`: *number*, `addressOptions?`: {}): *Promise*<{} \| *undefined*\>

Get the first unspent address.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`client` | [*IClient*](../interfaces/models/iclient.iclient.md) | The client to send the transfer with.   |
`seed` | [*ISeed*](../interfaces/models/iseed.iseed.md) | The seed to use for address generation.   |
`accountIndex` | *number* | The account index in the wallet.   |
`addressOptions?` | {} | Optional address configuration for balance address lookups.   |

**Returns:** *Promise*<{} \| *undefined*\>

The first unspent address.
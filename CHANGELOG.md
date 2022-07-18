# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Ongoing Changes
### Added
- Route confirm claim in itau
- New notification type (PORTABILITY_NOTICE)
- Service and repository to search claim to direct participant itau
- Route cancel claim in itau
- Search from Itau
- Calculate, save, and return CID when inserting or updating an entry
- Create claim via Itau
- Each in unit test to update entry to direct participant itau
- Contracts to update key to direct participant itau
- Repository to update key to direct participant itau
- Service to update entry to direct participant itau

### Fixed
- Bug that caused some properties to disappear when updating an entry

## [1.5.0] - 13-10-2021
### Added
- Integration to remove entry in Itau
- Key creation to direct participant itau

### Changed
- Adjust to Confirm/Cancel claim when in internal context
- Verify if entry in the same ISPB is same owner with different account when trying to add a entry
- Verify if entry in the same ISPB is owned by a different person when trying to add a entry
- Adjust the claim consumer to receive messages on a single routing key
- Finisher method in Claim Consumer to call nack and send message to DLQ

### Fixed
- Exclude EVP type in search when to create a entry

## [1.4.4] - 23-09-2021
### Fixed
- Account type to create and update entries in repository

## [1.4.3] - 22-09-2021
### Added
- Migration to update payment account types

## [1.4.2] - 16-09-2021
### Added
- Payment account type in entries

## [1.4.1] - 23-08-2021
### Fixed
- Send fraud feedback before to open a claim

## [1.4.0] - 02-08-2021
### Changed
- Adjust the claim consumer to receive messages on a single routing key
- Finisher method in Claim Consumer to call nack and send message to DLQ

## [1.3.1] - 30-07-2021
### Fixed
- Complete with zeros the branch when to search entries

## [1.3.0] - 06-07-2021
### Added
- Create an internal claim if has same context
- Notify entries and claims for fraud feedback
- Insights to check entries and claims with security gateway
- Schema condition to validate if document is equal key when key type is CPF/CNPJ

### Fixed
- Moved local to send claim fraud feedback
- Optional requestId in claim fraud feedback
- Config vHost in AMQP connection
- Send ispb from entry in the check claim fraud

## [1.2.1] - 13-04-2021
### Fixed
- Create entry with key type EVP

## [1.2.0] - 13-04-2021
### Added
- Security gateway integration
- Find postback using ispb and account length to notify sub-accounts
- Save account info from entry when processing notification and player is a GRANTOR
- Add entryId in response when find claim by id and list claims
- Remove accents and special characters from names in the claim creation 

### Changed
- Do not return claims and entries with status FRAUD in the searches
- Adjust get claims to list by account info related to key
- Security gateway endpoint

### Fixed
- Save entry id in portability confirmation notification when player is GRANTOR
- Fixed random test failures

## [1.1.0] - 15-03-2021
### Added
- Add new filters (accountNumber, accountBranch and status) to get claims

### Changed
- Adjust interface to receive and validate new filters (bank account info and status) to find claim
- Improve schema to validate new filters (bank account and status) to find claim in use case
- Include new filters (bank account and status) to find claims in repository

### Fixed
- Fixed id field in notification payload
- Format uuid notifications from database

## [1.0.2] - 06-02-2021
### Fixed
- CI Scripts to push master jobs

## [1.0.1] - 06-02-2021
### Fixed
- CI Scripts and Authzn file

## [1.0.0] - 05-02-2021
### Added
- Migration to update type account entries table
- Service and Repository to find participants in json
- Remove accents and special characters from names in the entry creation
- Integrate job with the use case to send notifications
- Repository to send notifications
- Use case to sent notifications
- Service to save notification and use case to process claim notification
- Interface AMQP to process claim notification
- Repository to save notification and repository to find postback
- Migration to postbacks table
- Adding column notificationUrl in notification
- Contracts to get and send credit/debit notifications
- Contracts to save notification and find postback
- Adding notification migration
- Entry status
- Repository to search claims at Topazio
- Use case to list claims
- Interface http to list claims
- Interface to get claim by Id
- Repository to cancel claim
- Use case to cancel claim
- Interface to cancel claim
- Postback DOCs
- Added phone and e-mail properties
- Repository to create claim
- Use case to create claim
- Interface to create claim
- Contracts to cancel a claim
- Contracts to list claims
- Interface to confirm a claim
- Infra to confirm a claim
- Use case to confirm claim
- Contracts to confirm a claim
- Contracts to create claim
- Migration to claims table
- Infra to update credentials
- Interface to update credentials
- Use case to update credentials
- Repository for credentials
- Interface to add credentials
- Use case to add credentials
- Repository to remove credentials
- Use case to remove credentials
- Interface HTTP to remove credentials
- HTTP documentation for claims
- Use case to list entries by bank account
- Infra to list entries by bank account
- Interface to list entries by bank account
- Contracts to list keys by bank account
- HTTP documentation for list keys by bank account
- Service to find credentials
- Repository to find credentials
- Repository to add an entry
- Use Case to add a new Entry
- Add entry http interface
- Contract to add entry
- Contracts to remove entry in DICT
- Account opening date in the bank account information
- Service roles to access endpoints
- Repository to get an entry from database
- Interface http to get an entry locally
- Use case to get an entry locally
- Http interface to update entry in DICT
- Infra to update entry in DICT
- Use case to update entry
- Interface to search an entry
- Infra to search an entry
- Use case to search an entry
- Contract for credentials methods
- Credentials table
- Contract to search an entry
- Contract to get an entry locally
- Contract to add entry
- Infra to remove entry in DICT
- Use case to remove entry in DICT
- Interface HTTP to remove an entry in DICT
- Contracts to remove entry in DICT
- HTTP documentation for DICT entries management
- Contract to update entry

### Changed
- Change current_account to checking_account
- Improve find postback
- Ispb position in path
- Docs create claim with status 202
- Status PENDING and FAILED into claim table and rename columns
- Send credentials to repository throughout use cases
- Comment temporary roles to access
- Http status 204 to 404 in entry http interface
- Docs with status 404 

### Fixed
- Remove entry when claim failed to open and save postback
- Change find postback to get the right url notification
- Save extraInfo when process a ownership claim notification
- Remove email docs and schemas and add phone in schemas
- Adjust properties and unit test to process claim notification
- Adding verification if claim with status Failed and update entry
- Use ispb and account from a found entry to find postback
- Adding switch change account type in search entries
- Adding method in errorHandler for not found claim
- Validations to open claim
- Returns claimId when is created a claim
- List entries repo return
- Return not found error when update inexistent credential
- Unused reasons in update entry
- Removed DEFAULT_OPERATION reason in DOC
- Return credentialsUseCase from core container
- Added document property in search entry
- Return status to cancel a claim in the documentation
- Phone validation with limit of characteres
- Remove entry validations

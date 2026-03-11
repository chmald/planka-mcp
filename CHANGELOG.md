# Changelog

All notable changes to this project are documented in this file.

## [2.0.3] - 2026-03-10

### Added
- Support for API key authentication via `PLANKA_API_KEY` (`X-Api-Key` header), based on updated `swagger.json` security schemes.
- Versioned changelog to track API/schema-aligned server changes.

### Changed
- Moved `auth` tool from optional tools to core tools so authentication operations are available by default.
- Updated docs and examples to cover both API key and username/password authentication modes.

## [2.0.2] - Previous

### Changed
- Grouped tools architecture introduced with configurable core/admin/optional categories.

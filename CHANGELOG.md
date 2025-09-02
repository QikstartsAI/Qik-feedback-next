# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Next.js 14
- Material-UI integration for component library
- Tailwind CSS for styling
- Firebase integration for backend services
- Google Maps integration with @vis.gl/react-google-maps
- Form handling with react-hook-form and zod validation
- Phone number input component
- Animation support with react-spring
- Icon libraries (Tabler Icons, Radix UI Icons)
- TypeScript configuration
- ESLint configuration
- PostCSS and Autoprefixer setup

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- TypeScript compilation errors related to `string | undefined` type mismatches in feedback form components
  - Fixed type error in `FeedbackForm.tsx` where `formattedName(business?.BusinessId)` could return empty string for undefined BusinessId
  - Fixed type error in `FeedbackFormServices.tsx` with same pattern
  - Fixed type error in `BenitoMiamiForm.tsx` with same pattern  
  - Fixed type error in `PolloCustomForm.tsx` with same pattern
  - Added conditional checks `if (business?.BusinessId)` before calling `findIsCustomerInBusiness` function
  - Resolved build failures caused by TypeScript strict type checking

### Security
- N/A

## [0.1.0] - 2024-12-19

### Added
- Project initialization with create-next-app
- Basic Next.js application structure
- App Router configuration
- Global CSS setup
- Layout component
- Homepage component
- TypeScript configuration
- Tailwind CSS configuration
- ESLint setup
- Development and build scripts

---

## Version History

- **0.1.0** - Initial project setup and configuration

## Contributing

When adding new entries to this changelog, please follow these guidelines:

1. **Added** - for new features
2. **Changed** - for changes in existing functionality
3. **Deprecated** - for soon-to-be removed features
4. **Removed** - for now removed features
5. **Fixed** - for any bug fixes
6. **Security** - in case of vulnerabilities

## Notes

- This changelog follows the [Keep a Changelog](https://keepachangelog.com/) format
- Version numbers follow [Semantic Versioning](https://semver.org/)
- Dates are in YYYY-MM-DD format
- Unreleased section contains changes that are not yet released

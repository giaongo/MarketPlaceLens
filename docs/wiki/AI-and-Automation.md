# AI and Automation

AI features are disabled by default and must be enabled by an admin.

## Supported Providers

MarketPlaceLens uses OpenAI-compatible chat completions:

- OpenAI API
- Ollama
- LM Studio

Use **Test AI** in Settings after changing provider details.

## AI Inquiry Text

The inquiry feature drafts a seller message for manual copying. MarketPlaceLens does not send messages automatically.

Each user can store buyer details such as display name, location, contact note, and signature. These details are included when generating inquiry text.

## AI Job Drafts

The quick-job wizard can turn a sentence into a structured job draft with source, search terms, category hint, price, location, radius, age, and keyword rules.

## AI Listing Assessments

AI assessments summarize:

- fit to the saved search
- practical value or resale potential
- price plausibility against a typical used-market range
- missing details
- visible risks

Automatic assessment options can evaluate new listings during job runs or visible listing batches. These options can use many tokens.

## Data Sent to AI Providers

Depending on the feature, requests may include listing title, price, description, location, source metadata, match data, and user-provided buyer profile fields.

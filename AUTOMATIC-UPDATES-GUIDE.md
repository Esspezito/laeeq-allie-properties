# Automatic Property Updates System

## Overview
This system automatically updates property listings from the Greeff website every 7 days without any manual intervention. No retainer fees needed!

## How It Works

### 1. **Automatic Scheduling**
- Vercel Cron Job runs every 7 days at 3 AM UTC
- Configured in `vercel.json` with schedule: `0 3 */7 * *`
- No server maintenance required - runs on Vercel's infrastructure

### 2. **Update Process**
1. Fetches agent's listing page: https://www.greeff.co.za/results/agent/25192/
2. Extracts all current property URLs
3. Compares with existing properties to identify:
   - New listings (automatically added)
   - Removed listings (marked as sold)
   - Existing listings (kept active)
4. Scrapes details for new properties:
   - Title, price, location
   - Bedrooms, bathrooms, area
   - All property images
   - Description
5. Updates the data file with all changes
6. Sends email notification with summary

### 3. **Data Storage**
- Properties stored in `/data/properties.json`
- Update history in `/data/update-log.json`
- Automatically created on first run

### 4. **Email Notifications**
Sends notifications for:
- New properties added
- Properties marked as sold
- Errors during updates

## Setup Instructions

### 1. **Environment Variables**
Add these to your Vercel project settings:

```env
# Optional but recommended for security
CRON_SECRET=your-secret-key-here

# Email notifications (using Resend)
RESEND_API_KEY=re_your_api_key_here
NOTIFICATION_EMAIL=laeeq@greeff.co.za
FROM_EMAIL=noreply@your-domain.com
SITE_URL=https://your-site.vercel.app
```

### 2. **Resend Setup (for Email)**
1. Sign up at https://resend.com (free tier available)
2. Get your API key
3. Add your domain for sending emails
4. Add the API key to Vercel environment variables

### 3. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 4. **Manual Testing**
Test the update system manually:
```bash
# Local testing
node auto-update-properties.js

# Production testing (after deploy)
curl https://your-site.vercel.app/api/update-properties
```

## API Endpoints

### `/api/cron/update-properties`
- **Purpose**: Automatic cron job endpoint
- **Schedule**: Every 7 days
- **Method**: GET
- **Authentication**: Uses CRON_SECRET if configured

### `/api/update-properties`
- **Purpose**: Manual trigger for testing
- **Method**: GET
- **Response**: Update statistics and log

### `/api/properties`
- **Purpose**: Fetch current properties for display
- **Method**: GET
- **Response**: All active property listings

## File Structure

```
laeeq-allie-properties/
├── vercel.json                 # Cron job configuration
├── auto-update-properties.js   # Local update script
├── data/
│   ├── properties.json        # Current property data
│   └── update-log.json        # Update history
└── src/
    ├── app/
    │   └── api/
    │       ├── cron/
    │       │   └── update-properties/   # Cron job endpoint
    │       ├── update-properties/       # Manual trigger
    │       └── properties/              # Properties API
    └── lib/
        └── email-notifications.ts       # Email system

```

## Monitoring

### Check Update Status
1. View logs in Vercel dashboard
2. Check `/data/update-log.json` for history
3. Email notifications for each update

### Update Schedule
- Runs every 7 days automatically
- Time: 3:00 AM UTC
- Can be modified in `vercel.json`

## Troubleshooting

### Common Issues

1. **No updates happening**
   - Check Vercel function logs
   - Verify cron job is enabled in Vercel
   - Test manual endpoint

2. **Email not sending**
   - Verify RESEND_API_KEY is set
   - Check email addresses are correct
   - Review Resend dashboard for errors

3. **Properties not updating**
   - Check if Greeff website structure changed
   - Review scraper logs for errors
   - Verify data directory exists

### Manual Override
If automatic updates fail, run manually:
```bash
# From project root
node auto-update-properties.js
```

## Cost

### Free Tier Coverage
- **Vercel**: Free tier includes cron jobs
- **Resend**: 100 emails/day free
- **Storage**: Uses JSON files (minimal)

### Estimated Monthly Cost
- **$0** with free tiers
- Scales automatically with traffic

## Benefits

1. **No Manual Updates**: Fully automated
2. **No Retainer Fees**: Client doesn't pay for maintenance
3. **Always Current**: Updates every 7 days
4. **Error Recovery**: Automatic retry and notifications
5. **Scalable**: Handles any number of properties
6. **Cost-Effective**: Runs on free tier services

## Support

For issues or modifications:
1. Check Vercel function logs
2. Review update history in `/data/update-log.json`
3. Test manual update endpoint
4. Check email notifications

The system is designed to be completely hands-off after initial setup!
USE [JobPortalApplication]
GO

/****** Object:  Table [dbo].[ApplicationDetail]    Script Date: 6/9/2022 8:00:31 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ApplicationDetail](
	[ApplicationID] [int] IDENTITY(1,1) NOT NULL,
	[JobID] [int] NOT NULL,
	[JobTitle] [varchar](255) NULL,
	[ApplicantName] [varchar](255) NULL,
	[Contact] [varchar](10) NULL,
	[EmailID] [varchar](255) NULL,
	[Address] [varchar](512) NULL,
	[WorkExperience] [varchar](255) NULL,
	[IsReject] [bit] NULL,
	[DateOfBirth] [varchar](20) NULL,
	[PassingYear] [varchar](20) NULL,
	[CollegeName] [varchar](20) NULL,
	[Degree] [varchar](20) NULL,
	[CurrentStatus] [varchar](20) NULL,
	[Skill] [varchar](20) NULL,
	[Age] [varchar](20) NULL,
	[Gender] [varchar](20) NULL,
	[PinCode] [varchar](20) NULL,
	[Standerd10_Percentage] [varchar](10) NULL,
	[Standerd12_Percentage] [varchar](10) NULL,
	[Graduation_Aggregation] [varchar](10) NULL,
	[StreamName] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ApplicationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ApplicationDetail] ADD  DEFAULT ((0)) FOR [IsReject]
GO



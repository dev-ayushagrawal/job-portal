-- Create Database
create database JobPortalApplication;


 create table UserDetail
 (
  UserId int identity(1,1),
  UserName varchar(255),
  PassWord varchar(255),
  Role VARCHAR(10) NOT NULL CHECK (Role IN('user', 'admin', 'master')),
  InsertionDate varchar(255) default current_timestamp,
  IsActive bit default 1
 );

#Master User Sql Query
insert into UserDetail(UserName, PassWord, Role) values ('India@gmail.com','India@123','master');

create table fact_jobs_master
(
FieldID int identity(1,1) primary key,
FieldStream varchar(255) not null,
FieldName varchar(255) not null
)

insert into fact_jobs_master values('IT','Network administrator');
insert into fact_jobs_master values('IT','Systems analyst');
insert into fact_jobs_master values('IT','Database administrator');
insert into fact_jobs_master values('IT','Full-stack developer');
insert into fact_jobs_master values('IT','Senior software engineer');
insert into fact_jobs_master values('IT','Development operations engineer');
insert into fact_jobs_master values('IT','Cloud engineer');
insert into fact_jobs_master values('IT','IT security specialist');
insert into fact_jobs_master values('IT','Analytics manager');
insert into fact_jobs_master values('IT','Director of information technology');
insert into fact_jobs_master values('IT','Mobile developer');
insert into fact_jobs_master values('IT','Game developer');
insert into fact_jobs_master values('IT','Hardware engineer');
insert into fact_jobs_master values('IT','Web developer');
insert into fact_jobs_master values('IT','Help desk analyst');
insert into fact_jobs_master values('IT','IT coordinator');
insert into fact_jobs_master values('IT','Web administrator');

insert into fact_jobs_master values('Mechanical Engineer','Research and Development Engineer');
insert into fact_jobs_master values('Mechanical Engineer','Product Design Engineer');
insert into fact_jobs_master values('Mechanical Engineer','Sales and Marketing Engineer');
insert into fact_jobs_master values('Mechanical Engineer','Tool Engineer');
insert into fact_jobs_master values('Mechanical Engineer','Production Engineer');
insert into fact_jobs_master values('Mechanical Engineer','Maintenance Engineer');
insert into fact_jobs_master values('Mechanical Engineer','Quality Assurance');
insert into fact_jobs_master values('Mechanical Engineer','Power Plant Engineer');
insert into fact_jobs_master values('Mechanical Engineer','Purchase Engineer');
insert into fact_jobs_master values('Mechanical Engineer','Defense Engineers');

insert into fact_jobs_master values('Civil Engineer','Engineering Project Managers');
insert into fact_jobs_master values('Civil Engineer','Senior Civil Engineer');
insert into fact_jobs_master values('Civil Engineer','Engineering Managers');
insert into fact_jobs_master values('Civil Engineer','Civil Engineer');
insert into fact_jobs_master values('Civil Engineer','Architect');
insert into fact_jobs_master values('Civil Engineer','Engineering Inspectors and Regulatory Officers');
insert into fact_jobs_master values('Civil Engineer','Civil Engineering Drafter');
insert into fact_jobs_master values('Civil Engineer','Civil Engineering Technologist');
insert into fact_jobs_master values('Civil Engineer','Civil Engineering Technician');
insert into fact_jobs_master values('Civil Engineer','Land Surveyor');


create table JobDetail(
	JobId int identity(1,1) primary key,
	Title varchar(255) not null,
	Description text,
	Stream varchar(255),
	Field varchar(512),
	CompanyName varchar(255)
	Salary int, 
	DocumentUrl varchar(1024),
	IsActive bit,
	IsTrash bit default 0
);

create table FeedbackDetail(
	FeedbackID int identity(1,1) primary key,
	FeedBack varchar(255)
)

create table ApplicationDetail(
ApplicationID int identity(1,1) primary key,
JobID int not null,
JobTitle varchar(255),
ApplicantName varchar(255),
Contact varchar(10),
EmailID varchar(255),
Address varchar(512),
WorkExperience varchar(255),
Standerd10_Percentage varchar(10),
Standerd12_Percentage varchar(10),
Graduation_Aggregation varchar(10),
StreamName varchar(255),
IsReject bit default 0
)
create table StreamList(
StreamID int identity(1,1) primary key,
Stream varchar(255)
);

insert into StreamList values('Aeronautical Engineering');
insert into StreamList values('Industrial Engineering')
insert into StreamList values('Aerospace Engineering')
insert into StreamList values('Marine Engineering')
insert into StreamList values('Automobile Engineering')
insert into StreamList values('Mechanical Engineering')
insert into StreamList values('Biomedical Engineering')
insert into StreamList values('Mechatronics Engineering')
insert into StreamList values('Biotechnology Engineering')
insert into StreamList values('Metallurgical Engineering')
insert into StreamList values('Ceramic Engineering')
insert into StreamList values('Mining Engineering')
insert into StreamList values('Chemical Engineering')
insert into StreamList values('Petroleum Engineering')
insert into StreamList values('Civil Engineering')
insert into StreamList values('Power Engineering')
insert into StreamList values('Communications Engineering')
insert into StreamList values('Production Engineering')
insert into StreamList values('Computer Science Engineering')
insert into StreamList values('Robotics Engineering')
insert into StreamList values('Construction Engineering')
insert into StreamList values('Structural Engineering')
insert into StreamList values('Electrical Engineering')
insert into StreamList values('Telecommunication Engineering')
insert into StreamList values('Electronics & Communication Engineering')
insert into StreamList values('Textile Engineering')
insert into StreamList values('Electronics Engineering')
insert into StreamList values('Tool Engineering')
insert into StreamList values('Environmental Engineering')
insert into StreamList values('Transportation Engineering')

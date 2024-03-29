## Smart Chemical Inventory Management System (SCIMS)

Undergraduate Final Year Project (FYP) for the Bachelor of Computer Science (Honours) Program at School of Computer Sciences, Universiti Sains Malaysia (USM).

Deployed to the server at USM. Used by lectures, postgraduates and undergraduates from School of Chemical Sciences, USM.

![image](https://user-images.githubusercontent.com/43751067/182073870-6f8e6d08-ec7d-4ce9-badd-fff6b9a8891c.png)

### Project Background

Effective chemical storage plays an important role in the field of chemical safety and security. Chemicals stored in laboratory must be properly recorded so that users can locate and manage them easily. A good chemical inventory system can help to ensure the experiments can continue efficiently without any setbacks such as shortage of chemicals, it also allows users to keep track on every single chemical properly.

Smart Chemical Inventory Management System (SCIMS) is a web-based inventory management system with mobile application support that allows users to manage the chemical records easily. The main application will be the web application and the mobile application is used to support some relevant functions for the web application. They have different modules that provide different functionalities or supporting other functions.

### Modules & Functionalities

| Module                             | Function Provided                                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Lab Management                     | Add, View, Edit, Remove, Switch Lab, Apply New Lab, Manage Location                                                        |
| User Management                    | Add, View, Edit User, Login, Register, Profile Update, User Role, Manage Request                                           |
| Chemical Management                | Add, View, Edit, Disposal, Delete, Import, Export Chemical, Cancel Disposal, Record Usage, Chemical List                   |
| Safety Data Sheet (SDS) Management | Add, View, Edit, Upload SDS, Support Multi-Language SDS                                                                    |
| Notification                       | View Notification, Email, Mobile Push Notification                                                                         |
| QR Code                            | Generate, Scan, Export QR Code, Get Chemical Info, Stock Check                                                             |
| Automation                         | Extract SDS Info, Classify Chemical, Populate Chemical of Concern (CoC), Populate Existing SDS, Calculate Remaining Amount |
| Reports                            | Chemical Usage, Stock Check, Weekly Report                                                                                 |
| Logs                               | Chemical Usage, User Activity, Result of Import, View, Delete Server Logs                                                  |
| Supports                           | User Manual, Open, Reply, Resolve Tickets, Upload Attachments                                                              |
| Backups                            | Daily, Auto, Manual, Restore Backups, Download, Upload, Delete Backups                                                     |

### Tech Stack

- Progressive Web App (PWA)
- ReactJS
- ExpressJS
- NodeJS
- MongoDB
- TailwindCSS

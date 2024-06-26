import React, {useEffect, useState} from 'react';
import styled, {ThemeProvider, DefaultTheme} from 'styled-components'; // DefaultTheme import 추가
import {Link, useLocation} from 'react-router-dom';
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaPen,
    FaUsers,
    FaCode,
    FaPalette,
    FaBookOpen,
    FaCog
} from 'react-icons/fa';
import {GoChevronRight} from "react-icons/go";
import {Theme} from '../styles/theme';
import {Post, User} from '../api/types';
import {getUser, userProfilePic} from '../api/sidebar/api_getUser';
import {getMyPost} from "../api/board/api_PostView.ts";

const SidebarContainer = styled.div<{ theme: DefaultTheme }>`
    left: 0;
    min-height: 100vh;
    background-color: ${props => props.theme.Color.sideColor};
    flex-direction: column;
    padding: 20px;

    &.collapse {
        width: 80px;
    }

    &.default {
        width: 300px;
    }
`;
const Profile = styled.div`
    justify-content: center;
`;

const ProfileContainer = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
    z-index: auto;
    color: black;
`;

const ProfileImage = styled.img`
    border-radius: 50%;

    &.collapse {
        width: 100%;
    }

    &.default {
        width: 70px;
        left: 27px;
    }
`;

const ProfileName = styled.div`
    font-size: 13pt;
    font-weight: bold;
`;

const ProfileText = styled.div`
    margin-left: 15px;
    width: 100%;
    flex-direction: column;
`;

const ContainerOption = styled.div`
    margin-top: 1vw;
    margin-right: 2vw;
    display: flex;
    justify-content: space-between;
    font-size: 10pt;
`;

const SettingLink = styled(Link)`
    margin: -3px 20px 0 0;
    padding: 5px;
    color: black;
    &:active {
        color: gray;
    }
`;

const LinkMyPageIcon = styled(Link)`
    color: ${props => props.theme.Color.gray};
    cursor: pointer;
`

const ProfileLink = styled.div`
    display: flex;
    flex-direction: row;
`;

const ProfileEmail = styled.div`
    margin-top: 5px;
    font-size: 12px;
    color: #AAA;
`;

const ButtonContainer = styled.div`
    margin-top: 50px;
`;

const Button = styled(Link) <{ isSelected: boolean }>`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 17px;
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: ${props => props.isSelected ? '#EDF1F8' : props => props.theme.Color.sideColor};
    color: ${props => props.isSelected ? '#196CE9' : '#A0B2C1'};
    font-weight: ${props => props.isSelected ? 'bold' : 'none'};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        box-shadow: 0 0 10px #EEE;
        color: #196CE9;
        font-weight: bold;
    }
`;

const AngleArrow = styled.div`
    cursor: pointer;
    text-align: center;

    &.default {
        margin-left: 240px;
    }
    &.collapse {
        margin-bottom: 20px;
    }
`;

const Sidebar: React.FC = () => {
    const userInfo = 1;
    const [user, setUser] = useState<User>();
    const [post, setPost] = useState<Post[]>([]);
    const [postLength, setPostLength] = useState(0);
    const [isCollapse, setIsCollapse] = useState(false);
    const [selectedButton, setSelectedButton] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUser(userInfo);
                setUser(data);
            } catch (error) {
                console.error('유저를 불러오는 데 실패했습니다.');
            }
        };

        fetchUserData();
    }, [userInfo]);

    useEffect(() => {
        setSelectedButton(location.pathname);
    }, [location]);

    useEffect(() => {
        const fetchCntPost = async () => {
            try {
                const data = await getMyPost(userInfo);

                // 이전 상태와 비교하여 실제로 변경이 발생한 경우만 상태 업데이트
                if (JSON.stringify(data) !== JSON.stringify(post)) {
                    setPost(data);
                    setPostLength(data.length ?? 0); // data를 사용하여 길이를 설정
                }
            } catch (error) {
                console.error('게시물 정보를 불러오는데 실패했습니다.', error);
            }
        };
        fetchCntPost();
    }, [post, userInfo]);

    const HandleCollapse = () => {
        setIsCollapse(isCollapse => !isCollapse);
    }


    return (
        <ThemeProvider theme={Theme}>
            <SidebarContainer className={isCollapse ? 'collapse' : 'default'}>
                <AngleArrow className={isCollapse ? 'collapse' : 'default'} onClick={HandleCollapse}>
                    {isCollapse ? (
                        <div>
                            <FaAngleDoubleRight/>
                        </div>
                    ) : (
                        <div>
                            <FaAngleDoubleLeft/>
                        </div>
                    )}
                </AngleArrow>
                <Profile>
                    <ProfileContainer to="/user/1">
                    {user && (
                        <ProfileImage src={userProfilePic(user.id)} alt="Profile"
                                      className={isCollapse ? 'collapse' : 'default'}/>
                    )}
                    {!isCollapse && user && (
                        <>
                            <ProfileText>
                                <ProfileLink>
                                    <ProfileName>{user.name}</ProfileName>
                                    <LinkMyPageIcon to="/user/1"><GoChevronRight/></LinkMyPageIcon>
                                </ProfileLink>
                                <ProfileEmail>{user.email}</ProfileEmail>
                                <ContainerOption>
                                    <div>
                                        내 게시물 {postLength}
                                    </div>
                                    <SettingLink to="/settings">
                                        <FaCog/>
                                    </SettingLink>
                                </ContainerOption>
                            </ProfileText>
                            <br/>
                        </>
                    )}
                    </ProfileContainer>
                </Profile>
                <ButtonContainer>
                    <Button to="/post" isSelected={selectedButton === '/post'}>
                        <FaPen/>
                        {isCollapse ? '' : '글쓰기'}
                    </Button>
                    <Button to="/" isSelected={selectedButton === '/'}>
                        <FaUsers/>
                        {isCollapse ? '' : '팀프로젝트'}
                    </Button>
                    <Button to="/developers" isSelected={selectedButton === '/developers'}>
                        <FaCode/>
                        {isCollapse ? '' : '개발자'}
                    </Button>
                    <Button to="/designs" isSelected={selectedButton === '/designs'}>
                        <FaPalette/>
                        {isCollapse ? '' : '디자이너'}
                    </Button>
                    <Button to="/study" isSelected={selectedButton === '/study'}>
                        <FaBookOpen/>
                        {isCollapse ? '' : '스터디'}
                    </Button>
                </ButtonContainer>
            </SidebarContainer>
        </ThemeProvider>
    );
};

export default Sidebar;
app.controller('usuariosHavanController', function($scope, $http,$timeout,growl){
    
    if (!$scope.permissoes[37]){
        window.location = "LOGIN/login.html";
    };

    $scope.baseApiHavan = 'http://192.168.0.143:7500/'

    $scope.gototop();  
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };       
    
    $scope.divVisualizar = false;
    $scope.divCadastro = false;
    $scope.botaoVolta = false;
    $scope.divPermissao = false;
    $scope.divPermissaoMenu = false;
    $scope.divPermissaoSubMenu = false; 
    $scope.divAconra = false;
    $scope.divSmart = false;
    $scope.divHavan = false;
    $scope.userSmart = [];

    $scope.dadosCadastroUsuario = {
        nome:'',
        usuario: '',
        senha: '',
        confirmaSenha: '',
        email: ''
    };

    $scope.usuarioSmart = function(){
        $http({
            url: $scope.baseApiHavan +  'havan/smartUsuario/',
            method: 'GET',           
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': "usuarios-smart"            
            }
        }).then(function(event){
            $scope.userSmart = event.data.usuarioSmart;   
            console.log($scope.userSmart)              
        }).catch(function(err){
            $scope.transPend.visaoGeral = false;
            console.log(err)
            growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:1.1');                
        })
    };

    $scope.usuarioSmart();  
    
    //==========  POST PARA PESQUISA USUARIOS HAVAN ==========//
    $scope.pesquisaUsuarioHavan = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApiHavan +'havan/pesquisaUsuarioHavan/',
                method: 'GET',              
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'pesquisa-usuario-havan'
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false; 
                        
                if(event.data.error == true && !$scope.login.superUser){
                    growl.warning('<b>ATENÇÃO!</b><br> Não existe usuário Havan cadastrado');  
                    $scope.divCadastro = true;
                    $scope.divHavan = true;
                }else{
                    $scope.infoUsuario = event.data.usuarios;
                    $scope.divVisualizar = true;
                    $scope.divCadastro = false;
                    $scope.divAconra = true;                   
                    
                    if($scope.login.superUser == false){
                        $scope.divHavan = true;
                    };                    
                };              
            }).catch(function(err){             
                growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:92');                   
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };
    }; 
 
    //==========  CHAMANDA DA FUNÇÃO PESQUISA USUARIOS HAVAN ==========//
    $scope.pesquisaUsuarioHavan();
 
    //==========  POST PARA CADASTRAR USUARIOS HAVAN ==========//
    $scope.cadastroUsuarioHavan = function(){
        if( $scope.dadosCadastroUsuario.senha ==  $scope.dadosCadastroUsuario.confirmaSenha){
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){          
                $scope.transPend.visaoGeral = true;
                $http
                ({
                    url: $scope.baseApiHavan +'havan/cadastroUsuarioHavan/',
                    method: 'POST',
                    data: {'cadastroUsuarioHavan': $scope.dadosCadastroUsuario},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': 'info-Havan-Cadastro' + $scope.dadosCadastroUsuario.usuario
                                       
                    }
                }).then(function(event){
                    $scope.transPend.visaoGeral = false;
                    if(event.status == 200){
                        growl.success('<b>SUCESSO!</b><br>Usuário cadastrado!');   
                        $scope.divCadastro = false;
                        $scope.pesquisaUsuarioHavan();
                    }else{
                        growl.warning('<b>SUCESSO!</b><br>Usuário não cadastrado!');   
                    };                        
                }).catch(function(err){
                    console.log(err);
                    $scope.transPend.visaoGeral = false;                    
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                    }else{
                        growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:93');  
                    };               
                });                 
            }else {
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
            }; 
        }else{
            growl.warning('<b>ATENÇÃO!</b><br>Senhas digitadas são diferentes!');   
        };          
    };

    //==========  CHAMANDA DO MODAL EDITAR USUÁRIO HAVAN ==========//
    $scope.modalEditar = function(id,nome,usuario,email){
        $scope.editarUsuario = {
            usuario: usuario,  
            novaSenha:'' , 
            confirmeSenha: '',
            email: email,
            nome: nome,  
            id: id         
        };          
        $('#modalEditarUsuario').trigger('click');
    };

    //========== VALIDAÇÃO EDITAR USUÁRIO ==========//
    $scope.editarCadastroUsuarioHavan = function(){
        
        if($scope.editarUsuario.novaSenha){
            if($scope.editarUsuario.novaSenha ==  $scope.editarUsuario.confirmaSenha){
                $scope.editarUsuarioHavan();
            }else{
                growl.warning('<b>ATENÇÃO!</b><br>Senhas digitadas são diferentes!'); 
            };   
        }else{    
            $scope.editarUsuarioHavan();
        }    
    };

    //========== POST EDITAR USUÁRIO ==========//
    $scope.editarUsuarioHavan = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){           
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApiHavan +'havan/editarUsuarioHavan/',
                method: 'PUT',
                data: {'editarUsuarioHavan': $scope.editarUsuario},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'editar-usuario_havan' + $scope.editarUsuario.usuario
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;
                if(event.status == 200){
                    growl.success('<b>SUCESSO!</b><br>Usuário alterado!');   
                    $scope.divCadastro = false;
                    $('#myModalEditarUsuario').modal('hide');      
                    $scope.pesquisaUsuarioHavan();
                }else{
                    growl.warning('<b>SUCESSO!</b><br>Usuário não alterado!');   
                };                        
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                    
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:94');  
                };               
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        }; 
    };

    //==========  CHAMANDA DO MODAL PARA INATIVAR USUÁRIO HAVAN ==========//
    $scope.modalInativoStatus = function(status, id, nome){
        if(status == true){
            status = 'F'
        }else{
            status = 'T'
        }
        $scope.inativarUsuario = {
            status:status,
            nome: nome,
            id: id         
        };
        $('#modalInativarUsuario').trigger('click');   
    };

    //========== POST INATIVAR O USUÁRIO ==========//
    $scope.inativarUsuarioHavan = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.dadosCadastroUsuario.usuario = $scope.login.usuario;
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApiHavan +'havan/inativarUsuarioHavan/' + $scope.inativarUsuario.status + '/' + $scope.inativarUsuario.id,
                method: 'DELETE',              
                headers: { 
                    'Content-Type':  'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'inativar-usuario-havan'
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;
                if(event.status == 200){
                    if($scope.inativarUsuario.status == 'S'){
                        growl.success('<b>SUCESSO!</b><br>Usuário ativo!'); 
                    }else{
                        growl.success('<b>SUCESSO!</b><br>Usuário inativo!'); 
                    }                   
                    $('#myModalInativarUsuario').modal('hide');      
                    $scope.pesquisaUsuarioHavan();
                }else{
                    growl.warning('<b>SUCESSO!</b><br>Status não foi alterado!');   
                };                        
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                    
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:95');  
                };               
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };         
    };
   
    $scope.menu = function(value,nome,id){
        if(value == 1){
            $scope.divVisualizar = false;
            $scope.divCadastro = true;
            $scope.botaoVolta = true;
        }else if(value == 2){
            $scope.divVisualizar = true;
            $scope.divCadastro = false;
            $scope.botaoVolta = false;
            $scope.divPermissao = false;
            $scope.divPermissaoMenu = false;
            $scope.divPermissaoSubMenu = false;
            $scope.botaoSubmenu = false;
            $scope.login.superUser = true;
        }else if(value == 3){
            $scope.botaoVolta = true;
            $scope.divPermissao = true;          
            $scope.divVisualizar = false;
            $scope.divCadastro = false;
            $scope.usuarioID = id;
            $scope.login.superUser = false;
            $scope.pesquisaPermissaoUsuarioHavan(nome,id);
        }else if( value == 4){
            $scope.divPermissaoMenu = true;
            $scope.divPermissaoSubMenu = false; 
            $scope.botaoVolta = true;
            $scope.botaoSubmenu = false;
        }else if(value == 5){
            if(nome == 'smart'){
                $scope.divSmart = true;
                $scope.divHavan = false;
            }else{
                $scope.divSmart = false;
                $scope.divHavan = true;
            }
        };
    };

    //========== POST PARA PESQUISA PERMISSAO DO USUARIO ==========//
    $scope.pesquisaPermissaoUsuarioHavan = function(nome,id){
        $scope.infoPermissao = {
            nome: nome,
            id: id
        }
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.dadosCadastroUsuario.usuario = $scope.login.usuario;
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApiHavan +'havan/pesquisaPermissaoUsuarioHavan/' + id + '/' + nome,
                method: 'GET',              
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'permissao_usuario_havan' + nome
                }
            }).then(function(event){
                    $scope.transPend.visaoGeral = false;
                    $scope.menus = event.data.menuPermissao;
                    $scope.divPermissao = true;                                                      
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                 
                growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:96');                             
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };       
    };

    //========== POST PARA LIBERAR E BLOQUEAR PERMISSAO ==========//
    $scope.liberarPermissaoUsuarioHavan = function (){
         
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.dadosCadastroUsuario.usuario = $scope.login.usuario;
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApiHavan +'havan/liberarPermissaoUsuarioHavan/',
                method: 'POST',
                data: {'liberarPermissaoUsuarioHavan': $scope.menus},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'liberar_menu_usuario' 
                }
            }).then(function(event){
                    $scope.transPend.visaoGeral = false;               
                    if(event.status == 200){
                        growl.success('<b>SUCESSO!</b><br>Permissão liberada ou Bloqueada!')     
                        $scope.pesquisaPermissaoUsuarioHavan($scope.infoPermissao.nome, $scope.infoPermissao.id)
                    }else{
                        growl.warning('<b>ATENÇÃO!</b><br>Permissão não liberada ou bloqueada!')
                    }                                   
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                    
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:97');  
                };               
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };   
    };

});

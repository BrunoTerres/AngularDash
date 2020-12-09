'use strict';
var app = angular.module('app', ['ngCookies','angular-growl','ngAnimate']);

angular.module('app').config(['growlProvider', function (growlProvider) {
  //Configuração do tempo que a mensagem ficará na tela
   growlProvider.globalTimeToLive({success: 5000, error:5000, warning:4000, info: 6000});
}]);

angular.module('app').controller('loginController', function($scope, $http, growl){
    console.log("loginController Acessado!");
        
    $scope.baseApi = '';
    $scope.baseApiHavan = 'http://192.168.0.143:7500/';
    $scope.autenticacao3fatores = false;
    var config = {};
    $scope.acesso = false;
    $scope.ping = function(url){
        $http.get(url + 'pingService/')
        .then(function(data){         
            if($scope.baseApi === ''){
                $scope.baseApi = url;         
                console.log($scope.baseApi)
                window.sessionStorage.setItem('baseApi', $scope.baseApi);
            }
        }).catch(function(error){
            console.log('pingErr', error);
        })
    };
    
    var apiLocal = false;  
    
    if(apiLocal){
        $scope.ping('http://127.0.0.1:7000/'); 
        $scope.ping('http://192.168.0.143:7000/');        
        
    }else{
        $scope.ping('http://192.168.0.103:7000/');         
        $scope.ping('http://200.150.114.227:7092/');   
    }
    
    $scope.login={
        usuario: '',
        ip:'',
        geoLocalizacao:'',
        senha: '',     
        nome: '',
        'logado': false,
        codvendedor: '',
        superuser:false,
        tentativa: 0
    };
    
    $scope.info = {
        'codigo':''        
    }
    
    $scope.codigoAcesso = {
        'tentativa' : 0
    }
    
    $scope.Email = false;
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };

    $scope.capturaIp = function(){
        $http({
            url: 'https://api.ipify.org?format=jsonp&callback=?',
            method: 'GET',
            headers: { 'Content-Type': 'application/javascript'}
        }).then(function(listOfdata){
            $scope.login.ip = JSON.parse(listOfdata.data.substring(2,listOfdata.data.length - 2)).ip;
        }).catch(function(error){
            console.log(error)
        })
    }
    
    $scope.capturaIp();

    $scope.capturaGL = function(){
        $http({
            url: 'http://ip-api.com/json/?callback=?',
            method: 'GET',
            headers: { 'Content-Type': 'application/javascript'}
        }).then(function(listOfdata){
            var localizacao = JSON.parse(listOfdata.data.substring(2,listOfdata.data.length - 2));
           $scope.login.geoLocalizacao = "Lat: " + localizacao.lat + " Lon: " + localizacao.lon + " Cidade: " + localizacao.city + " Estado: " + localizacao.regionName + "/" + localizacao.region + " Operadora: " + localizacao.isp + " Empresa: " + localizacao.org
        }).catch(function(error){
            console.log(error)
        })
    }
    
    $scope.capturaGL();

    window.sessionStorage.setItem('login', JSON.stringify($scope.login));  
      
    $scope.fazerLogin = function(){
        if($scope.login.usuario.trim()== '' || $scope.login.senha.trim() == ''){
            growl.info('<b>ATENÇÃO!</b><br>Usuário e senha devem ser preenchidos!')         
        }else{
             if($scope.transPend.visaoGeral==false){
                $scope.transPend.visaoGeral = true;
                $http({
                url: $scope.baseApi +  'loginWle/',
                method: 'POST',
                data: {'loginWle': $scope.login},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': "mixtel-distribuidora"            
                }
                }).then(function(data){
                    $scope.login =data.data;   
                    $scope.transPend.visaoGeral = false;  
                   
                  
                    if($scope.login.logado == true){               
                       if($scope.lerPermissoes($scope.login.idperfil)){                           
                            window.sessionStorage.setItem('login', JSON.stringify($scope.login));    
                           if($scope.acesso){
                                if($scope.login.codigoStatus == 'S'){
                                window.location = '../base.html';  
                            }else if($scope.login.codigoStatus == 'B'){
                                growl.warning('<b>ATENÇÃO!</b><br>Usuário bloqueado por 5 minutos.');  
                            }else if($scope.login.codigoStatus == 'E'){
                                $scope.autenticacao3fatores = false;     
                            } else{
                               $scope.autenticacao3fatores = true;                                
                            }  
                           }else{
                               window.location = '../base.html'; 
                           }                         
                       }else{
                            growl.warning('<b>ATENÇÃO!</b><br>Usuário sem permissão de acesso.');   
                       }
                    }else{ 
                        if ($scope.login.codigoStatus == 'B'){
                            growl.warning('<b>ATENÇÃO!</b><br>Usuário bloqueado por 5 minutos.');  
                            $scope.login.senha = '';
                        }else{
                            growl.warning('<b>ATENÇÃO!</b><br>Usuário e/ou senha inválido(s)!');   
                            $scope.login.senha = '';
                        }
                    }
                }).catch(function(err){
                    $scope.transPend.visaoGeral = false;
                    console.log(err)
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>Token utilizado para autenticação é inválido!');   
                    }else{
                        growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:1');   
                    }               
                })
             }else{                 
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
             }  
        };
    };    
 
    
    $scope.autenticacao3fatoresCodigo = function(){
       
        if($scope.info.codigo.trim() == '' || $scope.info.codigo.length > 5  || $scope.info.codigo.length < 5){            
           growl.info('<b>ATENÇÃO!</b><br>A chave de acesso deve ser preenchido ou tem mais ou menos de 5 dígitos!')  
        }else{
            $scope.infoGeral = {
                'usuario': $scope.login.usuario,
                'codigo': $scope.info.codigo,
                'tentativa': $scope.codigoAcesso.tentativa
            } 
            
           if($scope.transPend.visaoGeral==false){
                $scope.transPend.visaoGeral = true;
                $http({
                    url: $scope.baseApi +  'autenticacao3fatoresCodigo/',
                    method: 'POST',
                    data: {'autenticacao3fatoresCodigo':  $scope.infoGeral},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}      
                }).then(function(event){                  
                    $scope.codigoAcesso = event.data;  
                    $scope.transPend.visaoGeral = false;
                    if($scope.codigoAcesso.codigoStatus == "S"){
                       window.location = '../base.html';   
                    }else if($scope.codigoAcesso.codigoStatus == "B"){
                        growl.warning('<b>ATENÇÃO!</b><br>Usuário bloqueado por 5 minutos.');  
                    }                  
                    else{
                        growl.warning('<b>ATENÇÃO!</b><br>Código informado está incorreto.'); 
                    }    
                }).catch(function(err){                 
                    $scope.transPend.visaoGeral = false;
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 1.1');                     
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            }  
        };      
    };
    
    $scope.acessoSemEmail = function(status){
        $scope.Email = status;
        if($scope.login.codigoStatus == 'E'){
            if($scope.Email == true){
                window.location = '../base.html';                                      
            };
        };
    };
    
    $scope.lerPermissoes = function(id){
        $scope.permissoes = [
            false, false, false, false, false, false, false,false,false,false,false,false,false,false,
            false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,
            false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,
            false
        ]
        $scope.visGrpLojas = '';
        var ok = false;        
        //========== ADMINISTRADOR  ==========//
        if (id == '1'){
            //Todos
            ok = true;
            $scope.permissoes[0] = true;
            $scope.permissoes[1] = true;
            $scope.permissoes[2] = true;
            $scope.permissoes[3] = true;
            $scope.permissoes[4] = true;
            $scope.permissoes[5] = false;
            $scope.permissoes[6] = true;
            $scope.permissoes[7] = true; 
            $scope.permissoes[8] = true;
            $scope.permissoes[9] = true;
            $scope.permissoes[10] = true;
            $scope.permissoes[11] = true;
            $scope.permissoes[12] = true;
            $scope.permissoes[13] = true;
            $scope.permissoes[14] = true;
            $scope.permissoes[15] = true;
            $scope.permissoes[16] = true;
            if($scope.login.usuario != 'loibe.oliveira'){
                $scope.permissoes[17] = true;  
                $scope.permissoes[18] = true;
            }
            if($scope.login.usuario == 'felipe.bueno' || $scope.login.usuario == 'silvano'){
                $scope.permissoes[19] = true; 
            }
            $scope.permissoes[20] = true;
            $scope.permissoes[21] = true;
            $scope.permissoes[22] = true;
            $scope.permissoes[23] = true;
            $scope.permissoes[24] = true;
            $scope.permissoes[25] = true;
            $scope.permissoes[26] = true;
            $scope.permissoes[27] = true;
            $scope.permissoes[28] = true;
            $scope.permissoes[29] = true;
            $scope.permissoes[30] = true;
            $scope.permissoes[31] = true;
            $scope.permissoes[32] = true;
            $scope.permissoes[33] = true;
            $scope.permissoes[34] = true;
            $scope.permissoes[35] = true;
            $scope.permissoes[36] = true;
            $scope.permissoes[37] = true;
            $scope.permissoes[38] = true;
            $scope.permissoes[39] = true;
            $scope.permissoes[40] = true;
            $scope.permissoes[41] = true;
            $scope.permissoes[42] = true;
            $scope.permissoes[43] = true;
            $scope.permissoes[44] = true;
        }
        //========== LOGÍSTICA - FINANCEIRO - DAIANE ==========//
        else if (id == '2'){
            //GERENTES LOGISTICA - ES
            ok = true;
            $scope.permissoes[12] = true;
            $scope.permissoes[15] = true;
        }        
        //========== ATACADO VENDEDORES - INTERNOS  ==========//
        else if (id == '3' || id == '67' ){
            //ATACADO VENDEDORES INTERNOS
            ok = true;
          
            $scope.permissoes[12] = true;        
            if($scope.login.usuario == 'dash.atacado'){
                $scope.permissoes[13] = true;
                $scope.permissoes[31] = true;
                $scope.permissoes[3] = true;
            }else{
                $scope.permissoes[28] = true;              
                $scope.permissoes[8] = true;
            };
        }        
        //========== ATACAOD - SUPERVISOR TELEVENDAS  ==========//
        else if (id == '5'|| id == '11' || id == '62'){
            //Atacado
            ok = true;
            $scope.permissoes[0] = true;         
            $scope.permissoes[8] = true;
            $scope.permissoes[12] = true;
            $scope.permissoes[15] = true;
            $scope.permissoes[16] = true;
            $scope.permissoes[24] = true;
            $scope.permissoes[28] = true;
            $scope.permissoes[32] = true;
            $scope.permissoes[34] = true;
            $scope.permissoes[35] = true;
            $scope.permissoes[36] = true;
            $scope.permissoes[37] = true;
            $scope.permissoes[38] = true;
            $scope.permissoes[39] = true;
	    $scope.permissoes[1] = true;
            $scope.permissoes[4] = true;
            $scope.permissoes[9] = true;  
            $scope.permissoes[13] = true;
            $scope.permissoes[14] = true;

            	

        }        
        //========== LOJAS FÍSICAS- ANALISE DE PRODUTOS/ ANALISE DE PRODUTOS NOVOS ==========//
        else if (id == '22' || id == '51'){
            ok = true;     
            if($scope.login.usuario == 'jussara'){                  
                $scope.permissoes[12] = true;         
                $scope.permissoes[32] = true;
                $scope.permissoes[34] = true;
                $scope.permissoes[35] = true;
                $scope.permissoes[36] = true;
                $scope.permissoes[37] = true;
                $scope.permissoes[38] = true;
                $scope.permissoes[39] = true;
            }else{
                $scope.permissoes[1] = true;
                $scope.permissoes[2] = true;
                $scope.permissoes[4] = true; 
                $scope.permissoes[6] = true;
                $scope.permissoes[9] = true;
                $scope.permissoes[10] = true;
                $scope.permissoes[11] = true;
                $scope.permissoes[13] = true;
                $scope.permissoes[14] = true;
            };
        } 
        //========== FATURAMENTO - LOGÍSTICA SUB-SUPERVISÃO -  LOGÍSTICA SUPERVISÃO - FATURAMENTO - ACESSO INTERMEDIARIO  ==========//
        else if( id == '14' || id == '18' || id == '23' || id == '31' || id == '44'|| id == '72'){
            ok = true;
            //ECOMMERCE            
            $scope.permissoes[1] = true;
            $scope.permissoes[9] = true;
	    $scope.permissoes[13] = true;
            $scope.permissoes[14] = true;
            
            //ATACADO
            $scope.permissoes[12] = true;
            $scope.permissoes[15] = true;
            $scope.permissoes[28] = true;
            //LOGISTICA
            $scope.permissoes[21] = true;
            $scope.permissoes[22] = true;
            $scope.permissoes[23] = true;
            
            if($scope.login.usuario == 'patricia' || $scope.login.usuario == 'marizete'){
                $scope.permissoes[0] = true;               
                $scope.permissoes[2] = true;               
                $scope.permissoes[4] = true;                
                $scope.permissoes[6] = true;
                $scope.permissoes[7] = true;               
                $scope.permissoes[9] = true;
                $scope.permissoes[10] = true;
                $scope.permissoes[11] = true;   
                $scope.permissoes[30] = true; 
		$scope.permissoes[44] = true;           
            }
        }
        //========== ECOMMERCE - LOJA VIRTUAL GERENCIA / LOJA VIRTUAL SUPORTE  ==========//
        else if (id == '26' || id == '30' || id == '5'){
            //Ecommerce
            ok = true;
            $scope.permissoes[1] = true;
            $scope.permissoes[4] = true;
            $scope.permissoes[9] = true;  
            $scope.permissoes[13] = true;
            $scope.permissoes[14] = true;
            if(id == '26'){
                $scope.permissoes[29] = true; 
            }
        } 
        //========== CONTROLLER - SR. JOÃO ==========//
        else if(id == '32'){
            ok = true;
            $scope.permissoes[12] = true;
            $scope.permissoes[13] = true;
            $scope.permissoes[28] = true;
            $scope.permissoes[1] = true;
            $scope.permissoes[9] = true;
            $scope.permissoes[4] = true;
        }
        //========== LOJAS FÍSICAS - VENDEDORES  ==========//
        else if (id == '34'){
            ok = true;
            $scope.permissoes[6] = true; 
            $scope.permissoes[11] = true;
        }
        //========== LOJAS FÍSICAS - GERENTES COMERCIAIS ==========//
        else if (id == '35'){
            ok = true;       
            $scope.permissoes[6] = true;
            $scope.permissoes[7] = true; 
            $scope.permissoes[11] = true;
            $scope.permissoes[30] = true;
            $scope.permissoes[40] = true;
        }
        //========== LOJAS FÍSICAS - PERFIL ANDRESSA/ GERENTE COMERCIAL PR E SC  ==========//
        else if (id == '49' || id == '48' || id == '70')  {
            //Lj Fisicas - GERENTES
            ok = true;
            $scope.permissoes[2] = true;
            $scope.permissoes[6] = true;            
            $scope.permissoes[7] = true;
            $scope.permissoes[10] = true;  
            $scope.permissoes[11] = true;
            $scope.permissoes[30] = true; 
            $scope.permissoes[40] = true;
	    $scope.permissoes[44] = true;
        }
        //========== CONSULTORES EXTERNOS  ==========//
        else if (id == '43'){
            ok = true;
            $scope.permissoes[8] = true; 
            $scope.permissoes[12] = true;  
            $scope.permissoes[28] = true;
        }
        //========== ECOMMERCE/ATACADO - PERFIL ECOMMERCE - SUPERVISAO -  ==========//
        else if(id == '44'){
            ok = true; 
            if($scope.login.usuario == 'leonardo.g'){
                $scope.permissoes[1] = true;                        
                $scope.permissoes[5] = false;                                        
                $scope.permissoes[12] = true;
                $scope.permissoes[13] = true;             
                $scope.permissoes[15] = true;                       
                $scope.permissoes[20] = true;
                $scope.permissoes[21] = true;
                $scope.permissoes[22] = true;
                $scope.permissoes[23] = true;          
                $scope.permissoes[28] = true;               

	 		
            };     
      
            

        }
        //========== ECOMMERCE ATENDIMENTO  ==========//
        else if(id == '46'){
            ok = true; 
            if($scope.login.usuario == 'atendimento15'){
                $scope.permissoes[1] = true;   
                $scope.permissoes[13] = true;                        
                          
            };              
        }
        //========== LOGÍSTICA - SUB SUPERVISÃO  ==========//
        else if (id == '53'){
            ok = true;
           
            //ECOMMERCE            
            $scope.permissoes[1] = true;
            $scope.permissoes[13] = true;
            $scope.permissoes[14] = true;
            $scope.permissoes[28] = true;
            //ATACADO
            $scope.permissoes[12] = true;
            $scope.permissoes[15] = true;
            //LOGISTICA
            $scope.permissoes[21] = true;
            $scope.permissoes[22] = true;
            $scope.permissoes[23] = true;
            $scope.permissoes[0] = true;               
            $scope.permissoes[2] = true;               
            $scope.permissoes[4] = true;                
            $scope.permissoes[6] = true;
            $scope.permissoes[7] = true;               
            $scope.permissoes[9] = true;
            $scope.permissoes[10] = true;
            $scope.permissoes[11] = true;   
        }    

         //========== Marketing - SUB SUPERVISÃO  ==========//
         else if (id == '63'){
            ok = true; 
            $scope.permissoes[1] = true;
            $scope.permissoes[2] = true;
            $scope.permissoes[4] = true;
            $scope.permissoes[5] = false;
            $scope.permissoes[7] = true; 
            $scope.permissoes[9] = true;
            $scope.permissoes[10] = true;
            $scope.permissoes[11] = true;
            $scope.permissoes[13] = true;
            $scope.permissoes[14] = true;
            $scope.permissoes[20] = true;            
            $scope.permissoes[29] = true;                     
            $scope.permissoes[43] = true;           
        } 
             
        if ($scope.login.usuario == 'monitor'){
            for (var i in $scope.permissoes){
                $scope.permissoes[i] = false;
            }
            ok = true;
            $scope.login.superuser = true;
            $scope.permissoes[3] = true;
            $scope.permissoes[12] = true;
            
        }

        window.sessionStorage.setItem('permissoes', JSON.stringify($scope.permissoes));
        return ok;
    };
    
 });

